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
  user: User;
  cantCart = 0;

  userSubs: Subscription;
  cantCartSubs: Subscription;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.userSubs = this.store.select('auth').subscribe(({ user }) => {
      this.user = user;
    });

    this.cantCartSubs = this.store
      .select('cart')
      .subscribe(({ cant }) => (this.cantCart = cant));
  }

  ngOnDestroy() {
    this.userSubs?.unsubscribe();
    this.cantCartSubs?.unsubscribe();
  }

  get isAdmin() {
    return this.user?.role === userRole.admin;
  }
}
