import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../api';
import { ProfesoresComponent } from '../profesores/profesores';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ProfesoresComponent],
  template: `
    <nav class="navbar navbar-dark bg-dark mb-4">
      <div class="container-fluid">
        <span class="navbar-brand mb-0 h1">Panel Administrativo</span>
        <div class="d-flex align-items-center gap-3">
          <span class="text-light small">Admin</span>
          <button class="btn btn-outline-light btn-sm" (click)="logout()">Cerrar Sesión</button>
        </div>
      </div>
    </nav>

    <div class="container">
      <ul class="nav nav-tabs mb-4">
        <li class="nav-item">
          <button class="nav-link" [class.active]="tab === 'cursos'" (click)="tab = 'cursos'">Cursos</button>
        </li>
        <li class="nav-item">
          <button class="nav-link" [class.active]="tab === 'profesores'" (click)="tab = 'profesores'">Profesores</button>
        </li>
      </ul>

      @if (tab === 'cursos') {
        <div class="row">
          <div class="col-md-4 mb-4">
            <div class="card shadow-sm border-0 bg-light p-3">
              <h4>{{ editandoCurso ? 'Editar' : 'Crear Nuevo' }} Curso</h4>
              @if (errorMsg) {
                <div class="alert alert-danger py-1">{{ errorMsg }}</div>
              }
              @if (successMsg) {
                <div class="alert alert-success py-1">{{ successMsg }}</div>
              }
              <form [formGroup]="cursoForm" (ngSubmit)="guardarCurso()">
                <div class="mb-3">
                  <label class="form-label">Título del Curso</label>
                  <input type="text" class="form-control" formControlName="titulo" placeholder="Ej. Programación Web">
                </div>
                <div class="mb-3">
                  <label class="form-label">Descripción</label>
                  <textarea class="form-control" formControlName="descripcion" rows="3"></textarea>
                </div>
                <div class="mb-3">
                  <label class="form-label">Profesor</label>
                  <select class="form-select" formControlName="profesor">
                    <option value="">Sin asignar</option>
                    @for (p of profesores; track p._id) {
                      <option [value]="p._id">{{ p.nombre }} - {{ p.especialidad }}</option>
                    }
                  </select>
                </div>
                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-primary w-100" [disabled]="cursoForm.invalid">
                    {{ editandoCurso ? 'Actualizar' : 'Guardar' }}
                  </button>
                  @if (editandoCurso) {
                    <button type="button" class="btn btn-secondary" (click)="cancelarEdicionCurso()">Cancelar</button>
                  }
                </div>
              </form>
            </div>
          </div>

          <div class="col-md-8">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h4 class="mb-0">Cursos Activos</h4>
              <input type="text" class="form-control w-auto" placeholder="Buscar cursos..." (input)="buscarCursos($event)">
            </div>
            <div class="list-group shadow-sm">
              @for (curso of cursosFiltrados; track curso._id) {
                <div class="list-group-item">
                  <div class="d-flex justify-content-between align-items-start">
                    <div>
                      <div class="fw-bold">{{ curso.titulo }}</div>
                      <small class="text-muted">{{ curso.descripcion }}</small>
                      @if (curso.profesor?.nombre) {
                        <br><small class="text-secondary">Profesor: {{ curso.profesor.nombre }}</small>
                      }
                    </div>
                    <div class="text-end">
                      <span class="badge bg-secondary rounded-pill">{{ curso.estudiantes?.length || 0 }} inscritos</span>
                      <div class="mt-2">
                        <button class="btn btn-sm btn-outline-primary me-1" (click)="editarCurso(curso)">Editar</button>
                        <button class="btn btn-sm btn-outline-danger" (click)="eliminarCurso(curso._id)">Eliminar</button>
                      </div>
                    </div>
                  </div>
                </div>
              } @empty {
                <li class="list-group-item text-muted">No hay cursos registrados.</li>
              }
            </div>
          </div>
        </div>
      }

      @if (tab === 'profesores') {
        <app-profesores />
      }
    </div>
  `
})
export class DashboardComponent implements OnInit {
  cursoForm: FormGroup;
  cursos: any[] = [];
  cursosFiltrados: any[] = [];
  profesores: any[] = [];
  editandoCurso = false;
  editandoCursoId: string | null = null;
  errorMsg = '';
  successMsg = '';
  tab: 'cursos' | 'profesores' = 'cursos';

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) {
    this.cursoForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      profesor: ['']
    });
  }

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) this.router.navigate(['/login']);
    this.cargarCursos();
    this.cargarProfesores();
  }

  cargarCursos() {
    this.api.getCursos().subscribe({
      next: (res) => {
        this.cursos = res;
        this.cursosFiltrados = res;
      },
      error: () => this.errorMsg = 'Error cargando cursos'
    });
  }

  cargarProfesores() {
    this.api.getProfesores().subscribe({
      next: (res) => this.profesores = res,
      error: () => {}
    });
  }

  buscarCursos(event: any) {
    const term = event.target.value.toLowerCase();
    this.cursosFiltrados = this.cursos.filter((c: any) =>
      c.titulo.toLowerCase().includes(term) || c.descripcion.toLowerCase().includes(term)
    );
  }

  guardarCurso() {
    this.errorMsg = '';
    this.successMsg = '';
    const token = localStorage.getItem('token') || '';
    const data = this.cursoForm.value;

    if (this.editandoCurso && this.editandoCursoId) {
      this.api.actualizarCurso(this.editandoCursoId, data, token).subscribe({
        next: () => {
          this.successMsg = 'Curso actualizado';
          this.resetCursoForm();
          this.cargarCursos();
        },
        error: (err) => this.errorMsg = err.error?.error || 'Error al actualizar'
      });
    } else {
      this.api.crearCurso(data, token).subscribe({
        next: () => {
          this.successMsg = 'Curso creado con éxito';
          this.resetCursoForm();
          this.cargarCursos();
        },
        error: (err) => this.errorMsg = err.error?.error || 'Error al crear el curso'
      });
    }
  }

  editarCurso(curso: any) {
    this.editandoCurso = true;
    this.editandoCursoId = curso._id;
    this.cursoForm.patchValue({
      titulo: curso.titulo,
      descripcion: curso.descripcion,
      profesor: curso.profesor?._id || ''
    });
  }

  eliminarCurso(id: string) {
    if (!confirm('¿Eliminar este curso?')) return;
    const token = localStorage.getItem('token') || '';
    this.api.eliminarCurso(id, token).subscribe({
      next: () => {
        this.successMsg = 'Curso eliminado';
        this.cargarCursos();
      },
      error: (err) => this.errorMsg = err.error?.error || 'Error al eliminar'
    });
  }

  cancelarEdicionCurso() {
    this.resetCursoForm();
  }

  resetCursoForm() {
    this.cursoForm.reset({ profesor: '' });
    this.editandoCurso = false;
    this.editandoCursoId = null;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
