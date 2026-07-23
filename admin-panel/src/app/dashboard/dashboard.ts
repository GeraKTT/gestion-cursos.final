import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../api';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <nav class="navbar-modern">
      <div class="container d-flex align-items-center justify-content-between">
        <span class="fw-bold" style="font-size: 1.1rem; color: var(--slate-900);">
          <i class="bi bi-grid-fill me-2" style="color: var(--primary);"></i>Panel Administrativo
        </span>
        <button class="btn-modern btn-outline-modern" (click)="logout()">
          <i class="bi bi-box-arrow-right me-1"></i>Salir
        </button>
      </div>
    </nav>

        <div class="container py-4">
      @if (errorMsg) {
        <div class="alert-modern mb-4 d-flex justify-content-between align-items-center" style="background: var(--danger-light); color: var(--danger);">
          <span><i class="bi bi-exclamation-triangle me-1"></i>{{ errorMsg }}</span>
          <button type="button" style="background: none; border: none; color: inherit; font-size: 1.25rem; cursor: pointer;" (click)="errorMsg = ''">&times;</button>
        </div>
      }

      <div class="d-flex gap-2 mb-4">
        <button class="tab-modern" [class.active]="tab === 'cursos'" (click)="tab = 'cursos'">
          <i class="bi bi-book me-1"></i>Cursos
          @if (loadingCursos) { <span class="spinner-border spinner-border-sm ms-1" style="width: .75rem; height: .75rem;"></span> }
        </button>
        <button class="tab-modern" [class.active]="tab === 'profesores'" (click)="tab = 'profesores'">
          <i class="bi bi-people me-1"></i>Profesores
          @if (loadingProfesores) { <span class="spinner-border spinner-border-sm ms-1" style="width: .75rem; height: .75rem;"></span> }
        </button>
      </div>

      @if (tab === 'cursos') {
        <div class="row g-4">
          <div class="col-lg-4">
            <div class="card-modern p-4">
              <h5 class="fw-bold mb-3" style="color: var(--slate-900);">
                <i class="bi bi-plus-circle me-1" style="color: var(--primary);"></i>
                {{ editandoCurso ? 'Editar' : 'Nuevo' }} Curso
              </h5>
              @if (successMsg) {
                <div class="alert-modern mb-3" style="background: var(--success-light); color: var(--success);">{{ successMsg }}</div>
              }
              <form [formGroup]="cursoForm" (ngSubmit)="guardarCurso()">
                <div class="mb-3">
                  <label class="label-modern">Título</label>
                  <input type="text" class="input-modern w-100" formControlName="titulo" placeholder="Ej. Programación Web">
                </div>
                <div class="mb-3">
                  <label class="label-modern">Descripción</label>
                  <textarea class="input-modern w-100" formControlName="descripcion" rows="3" style="resize: vertical; min-height: 80px;"></textarea>
                </div>
                <div class="mb-3">
                  <label class="label-modern">Profesor</label>
                  <select class="input-modern w-100" formControlName="profesor">
                    <option value="">Sin asignar</option>
                    @for (p of profesores; track p._id) {
                      <option [value]="p._id">{{ p.nombre }} — {{ p.especialidad }}</option>
                    }
                  </select>
                </div>
                <div class="d-flex gap-2">
                  <button type="submit" class="btn-modern btn-primary-modern w-100" [disabled]="cursoForm.invalid">
                    {{ editandoCurso ? 'Actualizar' : 'Guardar' }}
                  </button>
                  @if (editandoCurso) {
                    <button type="button" class="btn-modern btn-outline-modern" (click)="cancelarEdicionCurso()">Cancelar</button>
                  }
                </div>
              </form>
            </div>
          </div>

          <div class="col-lg-8">
            <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
              <h5 class="fw-bold mb-0" style="color: var(--slate-900);">
                <i class="bi bi-collection me-1" style="color: var(--primary);"></i>Cursos Activos
              </h5>
              <input type="text" class="input-modern" placeholder="Buscar cursos..." style="width: 240px;" (input)="buscarCursos($event)">
            </div>

            @if (loadingCursos) {
              <div class="text-center py-5" style="color: var(--slate-500);">
                <div class="spinner-border mb-3" role="status" style="width: 2rem; height: 2rem;"></div>
                <div>Cargando cursos...</div>
              </div>
            } @else if (errorCursos) {
              <div class="text-center py-5" style="color: var(--danger);">
                <i class="bi bi-exclamation-triangle" style="font-size: 2rem; display: block; margin-bottom: .5rem;"></i>
                {{ errorCursos }}
                <button class="btn-modern btn-outline-modern d-inline-flex mt-3" (click)="cargarCursos()">Reintentar</button>
              </div>
            } @else {
              @for (curso of cursosFiltrados; track curso._id) {
              <div class="list-item-modern">
                <div class="d-flex justify-content-between align-items-start gap-3">
                  <div class="flex-grow-1">
                    <div class="fw-semibold mb-1" style="color: var(--slate-900);">{{ curso.titulo }}</div>
                    <div style="color: var(--slate-500); font-size: .8125rem;">{{ curso.descripcion }}</div>
                    @if (curso.profesor?.nombre) {
                      <div class="mt-1" style="color: var(--slate-500); font-size: .75rem;">
                        <i class="bi bi-person me-1"></i>{{ curso.profesor.nombre }}
                      </div>
                    }
                  </div>
                  <div class="text-end flex-shrink-0">
                    <span class="badge-modern" style="background: var(--primary-light); color: var(--primary);">
                      {{ curso.estudiantes?.length || 0 }} inscritos
                    </span>
                    <div class="mt-2 d-flex gap-1">
                      <button class="btn-modern btn-outline-modern" style="padding: .375rem .75rem; font-size: .8125rem;" (click)="editarCurso(curso)">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button class="btn-modern btn-outline-modern" style="padding: .375rem .75rem; font-size: .8125rem; color: var(--danger); border-color: transparent;" (click)="eliminarCurso(curso._id)">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
             } @empty {
              <div class="text-center py-5" style="color: var(--slate-500);">
                <i class="bi bi-inbox" style="font-size: 2rem; display: block; margin-bottom: .5rem;"></i>
                No hay cursos registrados
              </div>
            }
            }
          </div>
        </div>
      }

      @if (tab === 'profesores') {
        <div class="row g-4">
          <div class="col-lg-5">
            <div class="card-modern p-4">
              <h5 class="fw-bold mb-3" style="color: var(--slate-900);">
                <i class="bi bi-person-plus me-1" style="color: var(--primary);"></i>
                Nuevo Profesor
              </h5>
              <form [formGroup]="profesorForm" (ngSubmit)="guardarProfesor()">
                <div class="mb-3">
                  <label class="label-modern">Nombre</label>
                  <input type="text" class="input-modern w-100" formControlName="nombreProfesor" placeholder="Nombre completo">
                </div>
                <div class="mb-3">
                  <label class="label-modern">Especialidad</label>
                  <input type="text" class="input-modern w-100" formControlName="especialidadProfesor" placeholder="Ej. Redes">
                </div>
                <div class="mb-3">
                  <label class="label-modern">Correo</label>
                  <input type="email" class="input-modern w-100" formControlName="correoProfesor" placeholder="profesor@isil.pe">
                </div>
                <div class="d-flex gap-2">
                  <button type="submit" class="btn-modern btn-primary-modern w-100" [disabled]="profesorForm.invalid">
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div class="col-lg-7">
            <h5 class="fw-bold mb-3" style="color: var(--slate-900);">
              <i class="bi bi-people me-1" style="color: var(--primary);"></i>Profesores Registrados
            </h5>
            @if (loadingProfesores) {
              <div class="text-center py-5" style="color: var(--slate-500);">
                <div class="spinner-border mb-3" role="status" style="width: 2rem; height: 2rem;"></div>
                <div>Cargando profesores...</div>
              </div>
            } @else if (errorProfesores) {
              <div class="text-center py-5" style="color: var(--danger);">
                <i class="bi bi-exclamation-triangle" style="font-size: 2rem; display: block; margin-bottom: .5rem;"></i>
                {{ errorProfesores }}
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
                    <button class="btn-modern btn-outline-modern" style="padding: .375rem .75rem; font-size: .8125rem; color: var(--danger); border-color: transparent;" (click)="eliminarProfesor(p._id)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              }
            }
          </div>
        </div>
      }
    </div>
  `
})
export class DashboardComponent implements OnInit {
  cursoForm: FormGroup;
  profesorForm: FormGroup;
  cursos: any[] = [];
  cursosFiltrados: any[] = [];
  profesores: any[] = [];
  editandoCurso = false;
  editandoCursoId: string | null = null;
  errorMsg = '';
  successMsg = '';
  tab: 'cursos' | 'profesores' = 'cursos';
  loadingCursos = true;
  loadingProfesores = true;
  errorCursos = '';
  errorProfesores = '';

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router, private cdr: ChangeDetectorRef) {
    this.cursoForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      profesor: ['']
    });
    this.profesorForm = this.fb.group({
      nombreProfesor: ['', Validators.required],
      especialidadProfesor: ['', Validators.required],
      correoProfesor: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) this.router.navigate(['/login']);
    this.cargarCursos();
    this.cargarProfesores();
  }

  cargarCursos() {
    this.loadingCursos = true;
    this.errorCursos = '';
    this.cdr.detectChanges();
    this.api.getCursos().subscribe({
      next: (res) => {
        this.cursos = res;
        this.cursosFiltrados = res;
        this.loadingCursos = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingCursos = false;
        this.errorCursos = 'Error al cargar cursos. Verifica la conexión con el servidor.';
        this.errorMsg = this.errorCursos;
        this.cdr.detectChanges();
      }
    });
  }

  cargarProfesores() {
    this.loadingProfesores = true;
    this.errorProfesores = '';
    this.cdr.detectChanges();
    this.api.getProfesores().subscribe({
      next: (res) => {
        this.profesores = res;
        this.loadingProfesores = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingProfesores = false;
        this.errorProfesores = 'Error al cargar profesores. Verifica la conexión con el servidor.';
        this.cdr.detectChanges();
      }
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

  guardarProfesor() {
    if (this.profesorForm.invalid) return;
    const token = localStorage.getItem('token') || '';
    const data = {
      nombre: this.profesorForm.value.nombreProfesor,
      especialidad: this.profesorForm.value.especialidadProfesor,
      correo: this.profesorForm.value.correoProfesor
    };
    this.api.crearProfesor(data, token).subscribe({
      next: () => {
        this.profesorForm.reset();
        this.successMsg = 'Profesor creado exitosamente';
        this.cargarProfesores();
      },
      error: (err) => this.errorMsg = err.error?.error || 'Error al crear profesor'
    });
  }

  eliminarProfesor(id: string) {
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
