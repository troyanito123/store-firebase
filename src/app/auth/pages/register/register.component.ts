import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.reducer';
import * as uiActions from 'src/app/state/actions/ui.actions';

import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service';
import { EmailUniqueService } from 'src/app/utils/email-unique.service';
import { UtilsService } from 'src/app/utils/utils.service';
import { ValidatorService } from 'src/app/utils/validator.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;

  uiSubs: Subscription;

  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private utilsService: UtilsService,
    private emailUniqueService: EmailUniqueService,
    private validatorService: ValidatorService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.createRegisterForm();
    this.uiSubs = this.store
      .select('ui')
      .subscribe(({ isLoading }) => (this.isLoading = isLoading));
  }
  ngOnDestroy() {
    this.uiSubs?.unsubscribe();
  }

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.store.dispatch(uiActions.initLoading());

    const { name, email, password } = this.registerForm.value;

    this.authService
      .register(name, email, password)
      .then(() => {
        this.store.dispatch(uiActions.stopLoading());
        this.registerForm.reset();
        this.router.navigate(['/tabs/home']);
      })
      .catch(async (err) => {
        const alert = await this.utilsService.createAlert(err.message);
        this.store.dispatch(uiActions.stopLoading());
        this.registerForm.get('password').reset();
        this.registerForm.get('password2').reset();
        alert.present();
      });
  }

  private createRegisterForm() {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern(this.validatorService.emailPattern),
          ],
          [this.emailUniqueService],
        ],
        password: ['', [Validators.required]],
        password2: ['', [Validators.required]],
      },
      {
        validators: [this.validatorService.sameFields('password', 'password2')],
      }
    );
  }

  invalidField(field: string) {
    return (
      this.registerForm.get(field).invalid &&
      this.registerForm.get(field).touched
    );
  }

  get nameMessageError(): string {
    const errors = this.registerForm.get('name').errors;
    let message = '';
    if (errors?.required) {
      message = 'Nombre es obligatorio';
    } else if (errors?.minlength) {
      message = 'Nombre debe contener minimo 2 caracters';
    }
    return message;
  }

  get emailMessageError(): string {
    const errors = this.registerForm.get('email').errors;
    let message = '';
    if (errors?.required) {
      message = 'Email es obligatorio';
    } else if (errors?.unique) {
      message = 'Email ya registrado';
    } else if (errors?.pattern) {
      message = 'Tiene que ser un email valido';
    }
    return message;
  }

  get passwordMessageError(): string {
    const errors = this.registerForm.get('password').errors;
    let message = '';
    if (errors?.required) {
      message = 'Nombre es obligatorio';
    } else if (errors?.minlength) {
      message = 'Nombre debe contener minimo 6 caracters';
    }
    return message;
  }

  get password2MessageError(): string {
    const errors = this.registerForm.get('password2').errors;
    let message = '';
    if (errors?.required) {
      message = 'la confirmacion es obligatoria';
    } else if (errors?.noSame) {
      message = 'las contraseñas no coinciden';
    }
    return message;
  }
}
