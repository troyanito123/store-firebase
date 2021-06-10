import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import firebase from 'firebase/app';

export enum userRole {
  user = 'USER',
  admin = 'ADMIN',
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private db: AngularFireDatabase, private auth: AngularFireAuth) {}

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
}
