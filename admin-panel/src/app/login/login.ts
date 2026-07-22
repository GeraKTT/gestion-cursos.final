import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-5">
          <div class="card shadow-sm p-4 border-0 bg-light">
            <h2 class="text-center mb-4">Acceso Administrativo</h2>
            @if (errorMsg) {
              <div class="alert alert-danger py-2">{{ errorMsg }}</div>
            }
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
              <div class="mb-3">
                <label class="form-label">Correo Electrónico</label>
                <input type="email" class="form-control" formControlName="email" placeholder="admin@isil.pe">
                @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
                  <small class="text-danger">Ingrese un correo válido</small>
                }
              </div>
              <div class="mb-4">
                <label class="form-label">Contraseña</label>
                <input type="password" class="form-control" formControlName="password" placeholder="********">
                @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                  <small class="text-danger">La contraseña es obligatoria</small>
                }
              </div>
              <button type="submit" class="btn btn-dark w-100" [disabled]="loginForm.invalid">Iniciar Sesión</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMsg = '';

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.errorMsg = '';
    if (this.loginForm.valid) {
      this.api.login(this.loginForm.value).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.errorMsg = err.error?.error || 'Credenciales incorrectas o error de servidor';
        }
      });
    }
  }
}
