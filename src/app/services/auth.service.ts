import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import firebase from 'firebase/app';
import { Subscription } from 'rxjs';

import { User, userRole } from '../models/user';

import { Store } from '@ngrx/store';
import * as userActions from '../state/actions/auth.actions';
import { AppState } from '../state/app.reducer';

import { map, switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userSubs: Subscription;

  private _user: User;

  get user() {
    return { ...this._user };
  }

  constructor(
    private db: AngularFireDatabase,
    private auth: AngularFireAuth,
    private store: Store<AppState>
  ) {}

  initAuthListener() {
    this.auth.authState.subscribe((fuser) => {
      if (fuser) {
        this.userSubs = this.db
          .object(`users/${fuser.uid}`)
          .valueChanges()
          .subscribe((user: any) => {
            this._user = User.fromFirebase(user);
            this.store.dispatch(userActions.setUser({ user: this._user }));
          });
      } else {
        this._user = null;
        this.userSubs?.unsubscribe();
        this.store.dispatch(userActions.unsetUser());
        console.log(this._user);
      }
    });
  }

  register(name: string, email: string, password: string) {
    return this.auth
      .createUserWithEmailAndPassword(email, password)
      .then((resp) => {
        const uid = resp.user.uid;
        return this.db
          .object(`users/${uid}`)
          .set({ name, email, role: userRole.user, uid });
      });
  }

  login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe(map((fuser) => fuser != null));
  }

  isAdmin() {
    return this.auth.authState.pipe(
      switchMap((fuser) => this.db.object(`users/${fuser.uid}`).valueChanges()),
      map((userdb: any) => {
        const user = User.fromFirebase(userdb);
        return user.role === userRole.admin;
      }),
      take(1)
    );
  }
}
