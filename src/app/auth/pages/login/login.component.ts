import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UtilsService } from 'src/app/utils/utils.service';
import { ValidatorService } from 'src/app/utils/validator.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private utilsService: UtilsService,
    private validatorService: ValidatorService
  ) {}

  ngOnInit() {
    this.createloginForm();
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { name, email, password } = this.loginForm.value;

    this.authService
      .login(email, password)
      .then(() => {
        this.loginForm.reset();
        this.router.navigate(['/tabs/home']);
      })
      .catch(async (err) => {
        const alert = await this.utilsService.createAlert(err.message);
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
