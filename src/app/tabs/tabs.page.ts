import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { User, userRole } from '../models/user';
import { AppState } from '../state/app.reducer';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit, OnDestroy {
  userSubs: Subscription;
  user: User;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.userSubs = this.store.select('auth').subscribe(({ user }) => {
      this.user = user;
    });
  }

  ngOnDestroy() {
    this.userSubs?.unsubscribe();
  }

  get isAdmin() {
    return this.user?.role === userRole.admin;
  }
}
