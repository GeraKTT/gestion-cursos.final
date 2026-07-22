import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private headers(token?: string): HttpHeaders {
    let h = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) h = h.set('Authorization', `Bearer ${token}`);
    return h;
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  getCursos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses`);
  }

  getCurso(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses/${id}`);
  }

  crearCurso(curso: any, token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/courses`, curso, { headers: this.headers(token) });
  }

  actualizarCurso(id: string, curso: any, token: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/courses/${id}`, curso, { headers: this.headers(token) });
  }

  eliminarCurso(id: string, token: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/courses/${id}`, { headers: this.headers(token) });
  }

  getProfesores(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profesores`);
  }

  crearProfesor(profesor: any, token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/profesores`, profesor, { headers: this.headers(token) });
  }

  actualizarProfesor(id: string, profesor: any, token: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/profesores/${id}`, profesor, { headers: this.headers(token) });
  }

  eliminarProfesor(id: string, token: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/profesores/${id}`, { headers: this.headers(token) });
  }
}
