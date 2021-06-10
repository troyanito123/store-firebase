import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { StoreModule } from '@ngrx/store';
import { authReducer } from '../state/reducers/auth.reducer';

@NgModule({
  declarations: [LoginComponent, RegisterComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    IonicModule,
    ReactiveFormsModule,
    StoreModule.forFeature('auth', authReducer),
  ],
})
export class AuthModule {}
