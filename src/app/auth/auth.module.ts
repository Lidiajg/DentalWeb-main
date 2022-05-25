import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [LoginComponent, RegistroComponent],
  exports: [LoginComponent, RegistroComponent],
  imports: [CommonModule, ReactiveFormsModule,RouterModule],
})
export class AuthModule {}
