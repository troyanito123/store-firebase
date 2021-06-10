import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { User, userRole } from '../models/user';
import { AuthService } from '../services/auth.service';
import { AppState } from '../state/app.reducer';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  user: User;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.store.select('auth').subscribe(({ user }) => {
      this.user = user;
    });
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/auth/login']);
    });
  }

  get isAdmin() {
    return this.user?.role === userRole.admin;
  }
}
