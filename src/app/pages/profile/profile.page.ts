import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController } from '@ionic/angular';
import { CameraOptions, Camera } from '@ionic-native/camera/ngx';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {

  myProfileImage;
  myStoredProfileImage: Observable<any>;

  public mainuser: AngularFirestoreDocument
  public name: string
  public lastname: string
  public sub

  constructor( public authService: AuthService,
               private AFauth: AngularFireAuth,
               public db: AngularFirestore,
               private alertController: AlertController,
               private camera: Camera) { 

                this.mainuser = db.doc(`users/${this.AFauth.auth.currentUser.uid}`)
                this.sub = this.mainuser.valueChanges().subscribe( user => {
                  this.name = user.name
                  this.lastname = user.lastname
                })

                this.myStoredProfileImage = db
                  .collection('users')
                  .doc(this.AFauth.auth.currentUser.uid)
                  .valueChanges();
                }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  async selecttImageSource() {
    const cameraOptions: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetHeight: 150, targetWidth: 150,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA
    };

    const galleryOptions: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetHeight: 150, targetWidth: 150,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM
    };
    const alert = await this.alertController.create({
      header: 'Foto de perfil',
      message: 'Selecciona origen de la foto',
      buttons: [
        {
          text: 'Cámara',
          handler: () => {
            this.camera.getPicture(cameraOptions)
            .then((ImageData) => {
              // this.myProfileImage = "data:image/jpg;base64" + ImageData;
              const image = "data:image/jpg;base64" + ImageData;
              this.db
              .collection(`users`)
              .doc(this.AFauth.auth.currentUser.uid)
              .set({
                image_src: image
              });
            });
          }
        },
        {
          text: 'Galería',
          handler: () => {
            this.camera.getPicture(galleryOptions)
            .then((ImageData) => {
              // this.myProfileImage = "data:image/jpg;base64" + ImageData;
              const image = "data:image/jpg;base64" + ImageData;
              this.db
              .collection(`users`)
              .doc(this.AFauth.auth.currentUser.uid)
              .set({
                image_src: image
              });
            });
          }
        }
      ]

    });
    await alert.present();
  }

}
