import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  mainuser: AngularFirestoreDocument
  sub
  name : string;

  constructor( public authService : AuthService,
               public alertController: AlertController,
               public AFauth : AngularFireAuth,
               private db: AngularFirestore ) { 

                this.mainuser = db.doc(`users/${this.AFauth.auth.currentUser.uid}`)
                this.sub = this.mainuser.valueChanges().subscribe(user => {
                  this.name = user.name
                })

               }

  ngOnInit() {

  }

  ngOnDestroy() {
		// this.sub.unsubscribe()
  }

  onLogout() {
    this.presentAlert();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Sesión',
      subHeader: '¿Deseas cerrar sesión?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.authService.logout();
            this.sub.unsubscribe()
          }
        }
      ]
    });

    await alert.present();
  }

}
