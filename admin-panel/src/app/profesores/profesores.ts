import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api';

@Component({
  selector: 'app-profesores',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="row g-4">
      <div class="col-lg-5">
        <div class="card-modern p-4">
          <h5 class="fw-bold mb-3" style="color: var(--slate-900);">
            <i class="bi bi-person-plus me-1" style="color: var(--primary);"></i>
            {{ editando ? 'Editar' : 'Nuevo' }} Profesor
          </h5>
          @if (errorMsg) {
            <div class="alert-modern mb-3" style="background: var(--danger-light); color: var(--danger);">{{ errorMsg }}</div>
          }
          @if (successMsg) {
            <div class="alert-modern mb-3" style="background: var(--success-light); color: var(--success);">{{ successMsg }}</div>
          }
          <form [formGroup]="profesorForm" (ngSubmit)="guardar()">
            <div class="mb-3">
              <label class="label-modern">Nombre</label>
              <input type="text" class="input-modern w-100" formControlName="nombre" placeholder="Nombre completo">
            </div>
            <div class="mb-3">
              <label class="label-modern">Especialidad</label>
              <input type="text" class="input-modern w-100" formControlName="especialidad" placeholder="Ej. Redes">
            </div>
            <div class="mb-3">
              <label class="label-modern">Correo</label>
              <input type="email" class="input-modern w-100" formControlName="correo" placeholder="profesor@isil.pe">
            </div>
            <div class="d-flex gap-2">
              <button type="submit" class="btn-modern btn-primary-modern w-100" [disabled]="profesorForm.invalid">
                {{ editando ? 'Actualizar' : 'Guardar' }}
              </button>
              @if (editando) {
                <button type="button" class="btn-modern btn-outline-modern" (click)="cancelarEdicion()">Cancelar</button>
              }
            </div>
          </form>
        </div>
      </div>

      <div class="col-lg-7">
        <h5 class="fw-bold mb-3" style="color: var(--slate-900);">
          <i class="bi bi-people me-1" style="color: var(--primary);"></i>Profesores Registrados
        </h5>
        @if (loading) {
          <div class="text-center py-5" style="color: var(--slate-500);">
            <div class="spinner-border mb-3" role="status" style="width: 2rem; height: 2rem;"></div>
            <div>Cargando profesores...</div>
          </div>
        } @else if (errorCarga) {
          <div class="text-center py-5" style="color: var(--danger);">
            <i class="bi bi-exclamation-triangle" style="font-size: 2rem; display: block; margin-bottom: .5rem;"></i>
            {{ errorCarga }}
            <button class="btn-modern btn-outline-modern d-inline-flex mt-3" (click)="cargarProfesores()">Reintentar</button>
          </div>
        } @else {
          @if (profesores.length === 0) {
            <div class="text-center py-5" style="color: var(--slate-500);">
              <i class="bi bi-person" style="font-size: 2rem; display: block; margin-bottom: .5rem;"></i>
              No hay profesores registrados
            </div>
          }
          @for (p of profesores; track p._id) {
          <div class="list-item-modern d-flex justify-content-between align-items-center">
            <div>
              <div class="fw-semibold" style="color: var(--slate-900);">{{ p.nombre }}</div>
              <div style="color: var(--slate-500); font-size: .8125rem;">
                {{ p.especialidad }} <span style="color: var(--slate-300);">|</span> {{ p.correo }}
              </div>
            </div>
            <div class="d-flex gap-1">
              <button class="btn-modern btn-outline-modern" style="padding: .375rem .75rem; font-size: .8125rem;" (click)="editar(p)">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn-modern btn-outline-modern" style="padding: .375rem .75rem; font-size: .8125rem; color: var(--danger); border-color: transparent;" (click)="eliminar(p._id)">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        }
        }
      </div>
    </div>
  `
})
export class ProfesoresComponent implements OnInit {
  profesorForm: FormGroup;
  profesores: any[] = [];
  editando = false;
  editandoId: string | null = null;
  errorMsg = '';
  successMsg = '';
  loading = true;
  errorCarga = '';

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.profesorForm = this.fb.group({
      nombre: ['', Validators.required],
      especialidad: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    this.cargarProfesores();
  }

  cargarProfesores() {
    this.loading = true;
    this.errorCarga = '';
    this.api.getProfesores().subscribe({
      next: (res) => {
        this.profesores = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorCarga = 'Error al cargar profesores. Verifica la conexión con el servidor.';
        this.errorMsg = this.errorCarga;
      }
    });
  }

  guardar() {
    this.errorMsg = '';
    this.successMsg = '';
    const token = localStorage.getItem('token') || '';
    const data = this.profesorForm.value;

    if (this.editando && this.editandoId) {
      this.api.actualizarProfesor(this.editandoId, data, token).subscribe({
        next: () => {
          this.successMsg = 'Profesor actualizado';
          this.resetForm();
          this.cargarProfesores();
        },
        error: (err) => this.errorMsg = err.error?.error || 'Error al actualizar'
      });
    } else {
      this.api.crearProfesor(data, token).subscribe({
        next: () => {
          this.successMsg = 'Profesor creado exitosamente';
          this.resetForm();
          this.cargarProfesores();
        },
        error: (err) => this.errorMsg = err.error?.error || 'Error al crear'
      });
    }
  }

  editar(p: any) {
    this.editando = true;
    this.editandoId = p._id;
    this.profesorForm.patchValue({ nombre: p.nombre, especialidad: p.especialidad, correo: p.correo });
  }

  eliminar(id: string) {
    if (!confirm('¿Eliminar profesor?')) return;
    const token = localStorage.getItem('token') || '';
    this.api.eliminarProfesor(id, token).subscribe({
      next: () => {
        this.successMsg = 'Profesor eliminado';
        this.cargarProfesores();
      },
      error: (err) => this.errorMsg = err.error?.error || 'Error al eliminar'
    });
  }

  cancelarEdicion() {
    this.resetForm();
  }

  resetForm() {
    this.profesorForm.reset();
    this.editando = false;
    this.editandoId = null;
  }
}
