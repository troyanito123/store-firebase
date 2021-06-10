import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.reducer';
import * as uiActions from 'src/app/state/actions/ui.actions';

import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service';
import { UtilsService } from 'src/app/utils/utils.service';
import { ValidatorService } from 'src/app/utils/validator.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;

  uiSubs: Subscription;

  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private utilsService: UtilsService,
    private validatorService: ValidatorService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.createloginForm();
    this.uiSubs = this.store
      .select('ui')
      .subscribe(({ isLoading }) => (this.isLoading = isLoading));
  }

  ngOnDestroy() {
    this.uiSubs?.unsubscribe();
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.store.dispatch(uiActions.initLoading());

    const { email, password } = this.loginForm.value;

    this.authService
      .login(email, password)
      .then(() => {
        this.store.dispatch(uiActions.stopLoading());
        this.loginForm.reset();
        this.router.navigate(['/tabs/home']);
      })
      .catch(async (err) => {
        const alert = await this.utilsService.createAlert(err.message);
        this.store.dispatch(uiActions.stopLoading());
        this.loginForm.get('password').reset();
        alert.present();
      });
  }

  private createloginForm() {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(this.validatorService.emailPattern),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  invalidField(field: string) {
    return (
      this.loginForm.get(field).invalid && this.loginForm.get(field).touched
    );
  }

  get emailMessageError(): string {
    const errors = this.loginForm.get('email').errors;
    let message = '';
    if (errors?.required) {
      message = 'Email es obligatorio';
    } else if (errors?.pattern) {
      message = 'Tiene que ser un email valido';
    }
    return message;
  }

  get passwordMessageError(): string {
    const errors = this.loginForm.get('password').errors;
    let message = '';
    if (errors?.required) {
      message = 'Contraseña es obligatoria';
    } else if (errors?.minlength) {
      message = 'Contraseña debe contener minimo 6 caracters';
    }
    return message;
  }
}
