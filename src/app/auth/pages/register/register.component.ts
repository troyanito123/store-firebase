import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { EmailUniqueService } from 'src/app/utils/email-unique.service';
import { UtilsService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private utilsService: UtilsService,
    private emailUniqueService: EmailUniqueService
  ) {}

  ngOnInit() {
    this.createRegisterForm();
  }

  register() {
    if (this.registerForm.invalid) {
      return;
    }

    const { name, email, password } = this.registerForm.value;

    this.authService
      .register(name, email, password)
      .then(() => {
        this.registerForm.reset();
        this.router.navigate(['/tabs/home']);
      })
      .catch(async (err) => {
        const alert = await this.utilsService.createAlert(err.message);
        this.registerForm.get('password').reset();
        this.registerForm.get('password2').reset();
        alert.present();
      });
  }

  private createRegisterForm() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: [
        '',
        [Validators.required, Validators.email],
        [this.emailUniqueService],
      ],
      password: ['', [Validators.required]],
      password2: ['', [Validators.required]],
    });
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
    } else if (errors?.email) {
      message = 'Tiene que ser un email valido';
    }
    return message;
  }

  get passwordMessageError(): string {
    const errors = this.registerForm.get('email').errors;
    let message = '';
    if (errors?.required) {
      message = 'Nombre es obligatorio';
    } else if (errors?.minlength) {
      message = 'Nombre debe contener minimo 2 caracters';
    }
    return message;
  }

  get password2MessageError(): string {
    const errors = this.registerForm.get('email').errors;
    let message = '';
    if (errors?.required) {
      message = 'Nombre es obligatorio';
    } else if (errors?.minlength) {
      message = 'Nombre debe contener minimo 2 caracters';
    }
    return message;
  }
}
