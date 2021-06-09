import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EmailUniqueService implements AsyncValidator {
  constructor(private db: AngularFireDatabase) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const email = control.value;

    return this.existsEmail(email).pipe(
      map((exists) => (exists ? { unique: true } : null)),
      catchError((err) => of({ unique: true }))
    );
  }

  existsEmail(field: string) {
    return this.db
      .list('users')
      .valueChanges()
      .pipe(
        take(1),
        map((products) =>
          products.find((u: any) => u.email === field) ? true : false
        ),
        catchError((err) => of(false))
      );
  }
}
