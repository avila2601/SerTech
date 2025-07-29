import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject, map } from 'rxjs';
import { Tecnico } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TechnicianService {
  private readonly API_URL = 'https://sertech-backend.onrender.com';
  private tecnicos: Tecnico[] = [];
  private tecnicosSubject = new BehaviorSubject<Tecnico[]>([]);

  constructor(private http: HttpClient) {
    this.cargarTecnicos();
  }

  cargarTecnicos() {
    this.http.get<Tecnico[]>(`${this.API_URL}/tecnicos`).subscribe({
      next: (tecnicos) => {
        this.tecnicos = tecnicos;
        this.tecnicosSubject.next(this.tecnicos);
      },
      error: (error) => {
        console.error('Error cargando técnicos:', error);
        // Si falla la carga desde la API, usar datos locales de respaldo
        this.http.get<Tecnico[]>('assets/data/tecnicos.json').subscribe(tecnicos => {
          this.tecnicos = tecnicos;
          this.tecnicosSubject.next(this.tecnicos);
        });
      }
    });
  }

  getTecnicos(): Observable<Tecnico[]> {
    if (this.tecnicos.length > 0) {
      return of(this.tecnicos);
    }
    return this.tecnicosSubject.asObservable();
  }

  getTecnicoById(id: string): Observable<Tecnico | undefined> {
    if (this.tecnicos.length > 0) {
      return of(this.tecnicos.find(tecnico => tecnico.id === id));
    }
    return this.tecnicosSubject.asObservable().pipe(
      map(tecnicos => tecnicos.find(tecnico => tecnico.id === id))
    );
  }

  getTecnicosPorEspecialidad(especialidad: string): Observable<Tecnico[]> {
    return this.getTecnicos().pipe(
      map(tecnicos => tecnicos.filter(tecnico =>
        tecnico.especialidad.toLowerCase().includes(especialidad.toLowerCase()))
      )
    );
  }

  // Método para actualizar calificación de un técnico
  actualizarCalificacion(tecnicoId: string, calificacion: number): Observable<void> {
    return this.getTecnicoById(tecnicoId).pipe(
      map(tecnico => {
        if (tecnico) {
          tecnico.calificacion = calificacion;
          this.tecnicosSubject.next(this.tecnicos);
        }
        return;
      })
    );
  }

  autenticarTecnico(id: string, contraseña: string): Observable<boolean> {
    return this.getTecnicos().pipe(
      map(tecnicos => {
        const tecnico = tecnicos.find(t => t.id === id && t.contraseña === contraseña);
        return !!tecnico;
      })
    );
  }
}
