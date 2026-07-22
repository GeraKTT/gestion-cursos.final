import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api';

@Component({
  selector: 'app-profesores',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="row">
      <div class="col-md-5 mb-4">
        <div class="card shadow-sm border-0 bg-light p-3">
          <h4>{{ editando ? 'Editar' : 'Nuevo' }} Profesor</h4>
          @if (errorMsg) {
            <div class="alert alert-danger py-1">{{ errorMsg }}</div>
          }
          @if (successMsg) {
            <div class="alert alert-success py-1">{{ successMsg }}</div>
          }
          <form [formGroup]="profesorForm" (ngSubmit)="guardar()">
            <div class="mb-3">
              <label class="form-label">Nombre</label>
              <input type="text" class="form-control" formControlName="nombre" placeholder="Nombre completo">
            </div>
            <div class="mb-3">
              <label class="form-label">Especialidad</label>
              <input type="text" class="form-control" formControlName="especialidad" placeholder="Ej. Redes">
            </div>
            <div class="mb-3">
              <label class="form-label">Correo</label>
              <input type="email" class="form-control" formControlName="correo" placeholder="profesor@isil.pe">
            </div>
            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-primary w-100" [disabled]="profesorForm.invalid">
                {{ editando ? 'Actualizar' : 'Guardar' }}
              </button>
              @if (editando) {
                <button type="button" class="btn btn-secondary" (click)="cancelarEdicion()">Cancelar</button>
              }
            </div>
          </form>
        </div>
      </div>

      <div class="col-md-7">
        <h4>Profesores Registrados</h4>
        @if (profesores.length === 0) {
          <p class="text-muted">No hay profesores registrados.</p>
        }
        <div class="list-group shadow-sm">
          @for (p of profesores; track p._id) {
            <div class="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <div class="fw-bold">{{ p.nombre }}</div>
                <small class="text-muted">{{ p.especialidad }} | {{ p.correo }}</small>
              </div>
              <div>
                <button class="btn btn-sm btn-outline-primary me-1" (click)="editar(p)">Editar</button>
                <button class="btn btn-sm btn-outline-danger" (click)="eliminar(p._id)">Eliminar</button>
              </div>
            </div>
          }
        </div>
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
    this.api.getProfesores().subscribe({
      next: (res) => this.profesores = res,
      error: () => this.errorMsg = 'Error al cargar profesores'
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
