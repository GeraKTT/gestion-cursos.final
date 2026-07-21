import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../api'; 

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <nav class="navbar navbar-dark bg-dark mb-4">
      <div class="container-fluid">
        <span class="navbar-brand mb-0 h1">Panel Administrativo</span>
        <button class="btn btn-outline-light btn-sm" (click)="logout()">Cerrar Sesión</button>
      </div>
    </nav>

    <div class="container">
      <div class="row">
        <div class="col-md-4 mb-4">
          <div class="card shadow-sm border-0 bg-light p-3">
            <h4>Crear Nuevo Curso</h4>
            <form [formGroup]="cursoForm" (ngSubmit)="crearCurso()">
              <div class="mb-3">
                <label class="form-label">Título del Curso</label>
                <input type="text" class="form-control" formControlName="titulo" placeholder="Ej. Programación Web">
              </div>
              <div class="mb-3">
                <label class="form-label">Descripción</label>
                <textarea class="form-control" formControlName="descripcion" rows="3"></textarea>
              </div>
              <button type="submit" class="btn btn-primary w-100" [disabled]="cursoForm.invalid">Guardar Curso</button>
            </form>
          </div>
        </div>

        <div class="col-md-8">
          <h4>Cursos Activos</h4>
          <ul class="list-group shadow-sm">
            <li class="list-group-item d-flex justify-content-between align-items-start" *ngFor="let curso of cursos">
              <div class="ms-2 me-auto">
                <div class="fw-bold">{{ curso.titulo }}</div>
                {{ curso.descripcion }}
              </div>
              <span class="badge bg-secondary rounded-pill">{{ curso.estudiantes?.length || 0 }} inscritos</span>
            </li>
            <li class="list-group-item text-muted" *ngIf="cursos.length === 0">
              No hay cursos registrados todavía.
            </li>
          </ul>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  cursoForm: FormGroup;
  cursos: any[] = [];

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) {
    this.cursoForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.cargarCursos();
  }

  cargarCursos() {
    this.api.getCursos().subscribe({
      next: (res) => this.cursos = res,
      error: (err) => console.error('Error cargando cursos', err)
    });
  }

  crearCurso() {
    if (this.cursoForm.valid) {
      const token = localStorage.getItem('token') || '';
      this.api.crearCurso(this.cursoForm.value, token).subscribe({
        next: (res) => {
          alert('Curso creado con éxito');
          this.cursoForm.reset();
          this.cargarCursos(); 
        },
        error: (err) => alert('Error al crear el curso. Verifica tus permisos o la conexión.')
      });
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}