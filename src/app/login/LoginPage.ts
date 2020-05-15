import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastController, IonButton, IonLabel, IonText, IonTextarea, IonInput } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  status: string = 'Ingresar';
  @ViewChild('submitButton', { static: true }) ionsubmitButton: IonButton;


  constructor(private authService: AuthService, public router: Router, public toastContoller: ToastController) { }

  ngOnInit() {}

  doLogin() {
    this.status = 'Validando información..'
    this.ionsubmitButton.disabled = true;
    this.authService.login(this.email, this.password).then(() => {
      this.router.navigate(['/home']);
      this.toast('Bienvenido', 'success', 1000);
      this.ionsubmitButton.disabled = false;
    }).catch(err => {
      this.loginFlase();
      setTimeout(() => {
        this.ionsubmitButton.disabled = false;
      }, 500);
    });
  }

  async loginFlase() {
    if (this.email.length == 0 || this.password.length === 0) {
      this.toast('Debes completar los campos', 'warning', 1000);
    }
    else {
      this.toast('Los datos son incorrectos o el usuario no existe', 'danger', 1000);
      this.password = '';
    }
  }

  async toast(message: string, color: string, duration: number) {
    const toast = await this.toastContoller.create({
      message: message,
      duration: duration,
      color: color,
      mode: 'ios'
    });
    toast.present();
    setTimeout(() => {
      this.status = "Ingresar";
    }, 500);
  }
}
