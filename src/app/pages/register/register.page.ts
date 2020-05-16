import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController, IonButton } from '@ionic/angular';
import { Router } from '@angular/router';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  public email : string;
  public password : string;
  public cPassword : string;
  public name : string;
  public lastname : string;
  public date : Date;
  public status: string = 'Registrarme';
  @ViewChild('submitButton', { static: true }) ionsubmitButton: IonButton;

  constructor(private auth: AuthService,
              public toastController: ToastController,
              public router: Router) { }

  ngOnInit() {
  }

  onSubmitRegister() {
    this.status = 'Validando información..';
    this.ionsubmitButton.disabled = true;
    if (this.password === this.cPassword) {
      this.auth.register(this.email, this.password, this.name, this.lastname, this.date).then( auth => {
        this.toast(`Bienvenido ${this.name}, haz creado tu cuenta con éxito`, 'success', 2000);
        this.router.navigateByUrl('/home')
        this.ionsubmitButton.disabled = false;
        console.log(auth)
      }).catch(err => {
        setTimeout(() => {
          this.ionsubmitButton.disabled = false;
        }, 500);
        if (isNullOrUndefined(this.email || this.name)) {
          this.toast(`Completa los campos correspondientes`, 'danger', 2000);
        } else {
          this.toast(`Lo sentimos ${this.email} ya se encuentra registrado`, 'danger', 2000);
          this.email = ''
          this.password = ''
          this.cPassword = ''
        }
      })
    } else {
      this.toast(`Las contraseñas deben coincidir`, 'danger', 1000);
      this.cPassword = ''
    }
  }

  async toast(message: string, color: string, duration: number) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      color: color,
      mode: 'ios'
    });
    toast.present();
    setTimeout(() => {
      this.status = "Registrar";
    }, 500);
  }

}
