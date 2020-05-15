import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor ( private AFauth: AngularFireAuth,
                public router: Router,
                public toastContoller: ToastController ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.AFauth.authState.pipe(map( auth => {
        if ( isNullOrUndefined(auth) ) {
          console.log(auth)
          // this.router.navigateByUrl('/login'); También funciona este
          this.router.navigate(['/login'])
          this.toast('Debes iniciar sesión primero', 'danger', 1000)
          return false
        } else {
          console.log(auth)
          return true;
        }
      }))
  }

  async toast(message: string, color: string, duration: number) {
    const toast = await this.toastContoller.create({
      message: message,
      duration: duration,
      color: color,
      mode: 'ios'
    });
    toast.present();
  }
  
}
