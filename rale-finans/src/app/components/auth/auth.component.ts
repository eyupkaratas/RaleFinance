import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import AuthApiService from '../../services/api/auth-api.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatError,
    MatSnackBarModule,
  ],
  templateUrl: './auth.component.html',
})
export default class AuthComponent {
  #fb = inject(FormBuilder);
  #snackbar = inject(MatSnackBar);
  #authService = inject(AuthApiService);

  loginForm = this.#fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  registerForm = this.#fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    name: ['', Validators.required],
    surname: ['', Validators.required],
  });

  onLogin() {
    const formValue = this.loginForm.value;

    this.#authService
      .login(formValue.email ?? '', formValue.password ?? '')
      .subscribe();
  }

  onSignup() {
    const formValue = this.registerForm.value;

    this.#authService
      .signup(
        formValue.email ?? '',
        formValue.password ?? '',
        formValue.name ?? '',
        formValue.surname ?? ''
      )
      .subscribe(() => {
        this.#snackbar.open('Başarıyla kayıt olundu', 'Kapat', {
          duration: 3000,
          verticalPosition: 'bottom',
        });

        this.registerForm.reset();

        Object.keys(this.registerForm.controls).forEach((key) => {
          this.registerForm.get(key)!.setErrors(null);
        });
      });
  }
}
