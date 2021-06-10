import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanLoad,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { UtilsService } from '../utils/utils.service';

@Injectable({
  providedIn: 'root',
})
export class IsAuthGuard implements CanActivate, CanLoad {
  constructor(
    private authService: AuthService,
    private router: Router,
    private utilsService: UtilsService
  ) {}

  canActivate() {
    return this.authService.isAuth().pipe(
      tap((res) => {
        if (!res) {
          this.router.navigate(['/auth/login']).then(async () => {
            const toast = await this.utilsService.createToast(
              'Ingresa tus credenciales por favor!'
            );
            toast.present();
          });
        }
      })
    );
  }
  canLoad() {
    return this.authService.isAuth().pipe(
      tap((res) => {
        if (!res) {
          this.router.navigate(['/auth/login']).then(async () => {
            const toast = await this.utilsService.createToast(
              'Ingresa tus credenciales por favor!'
            );
            toast.present();
          });
        }
      }),
      take(1)
    );
  }
}
