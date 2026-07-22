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
    <div class="min-vh-100 d-flex align-items-center justify-content-center" style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);">
      <div class="card-modern p-5" style="width: 100%; max-width: 420px;">
        <div class="text-center mb-5">
          <div class="d-inline-flex align-items-center justify-content-center mb-3" style="width: 48px; height: 48px; background: #0f172a; border-radius: 12px;">
            <i class="bi bi-shield-lock text-white" style="font-size: 1.25rem;"></i>
          </div>
          <h3 class="fw-bold mb-1" style="color: var(--slate-900);">Acceso Administrativo</h3>
          <p class="mb-0" style="color: var(--slate-500); font-size: .875rem;">Ingresa tus credenciales para continuar</p>
        </div>

        @if (errorMsg) {
          <div class="alert-modern mb-4" style="background: var(--danger-light); color: var(--danger);">{{ errorMsg }}</div>
        }

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="mb-3">
            <label class="label-modern">Correo electrónico</label>
            <input type="email" class="input-modern w-100" formControlName="email" placeholder="admin@isil.pe">
            @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
              <small style="color: var(--danger); font-size: .75rem;">Ingrese un correo válido</small>
            }
          </div>
          <div class="mb-4">
            <label class="label-modern">Contraseña</label>
            <input type="password" class="input-modern w-100" formControlName="password" placeholder="••••••••">
            @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
              <small style="color: var(--danger); font-size: .75rem;">La contraseña es obligatoria</small>
            }
          </div>
          <button type="submit" class="btn-modern btn-primary-modern w-100" [disabled]="loginForm.invalid">
            Iniciar Sesión
          </button>
        </form>
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
