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
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { UtilsService } from '../utils/utils.service';

@Injectable({
  providedIn: 'root',
})
export class IsAdminGuard implements CanActivate, CanLoad {
  constructor(
    private authService: AuthService,
    private router: Router,
    private utilsService: UtilsService
  ) {}

  canActivate() {
    return this.authService.isAdmin().pipe(
      tap((res) => {
        if (!res) {
          this.router.navigate(['/tabs/home']).then(async () => {
            const toast = await this.utilsService.createToast(
              'No tienes los privilegios necesarios'
            );
            toast.present();
          });
        }
      })
    );
  }
  canLoad() {
    return this.authService.isAdmin().pipe(
      tap((res) => {
        if (!res) {
          this.router.navigate(['/tabs/home']).then(async () => {
            const toast = await this.utilsService.createToast(
              'No tienes los privilegios necesarios'
            );
            toast.present();
          });
        }
      }),
      take(1)
    );
  }
}
