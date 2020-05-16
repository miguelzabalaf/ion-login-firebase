import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {

  public mainuser: AngularFirestoreDocument
  public name: string
  public lastname: string
  public sub

  constructor( public authService: AuthService,
               private AFauth: AngularFireAuth,
               public db: AngularFirestore,
               private alertController: AlertController,) { 

                this.mainuser = db.doc(`users/${this.AFauth.auth.currentUser.uid}`)
                this.sub = this.mainuser.valueChanges().subscribe( user => {
                  this.name = user.name
                  this.lastname = user.lastname
                })
                }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  async selecttImageSource() {
    const alert = await this.alertController.create({
      header: 'Foto de perfil',
      message: 'Selecciona origen de la foto',
      buttons: [
        {
          text: 'Cámara',
          handler: () => {
            
          }
        },
        {
          text: 'Galería',
          handler: () => {

          }
        }
      ]

    });
    await alert.present();
  }

}
