import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, map } from 'rxjs';

export interface Resena {
  id: string;
  tecnicoId: string;
  clienteId: string;
  cliente: string;
  comentario: string;
  calificacion: number;
  fecha: string;
}

@Injectable({
  providedIn: 'root'
})
export class ResenaService {
  private readonly API_URL = 'https://sertech-backend.onrender.com';

  constructor(private http: HttpClient) {}

  // Obtener todas las reseñas
  getResenas(): Observable<Resena[]> {
    return this.http.get<Resena[]>(`${this.API_URL}/resenas`);
  }

  // Obtener reseñas por técnico
  getResenasPorTecnico(tecnicoId: string): Observable<Resena[]> {
    return this.getResenas().pipe(
      switchMap(resenas => {
        const resenasTecnico = resenas.filter(resena => resena.tecnicoId === tecnicoId);
        return new Observable<Resena[]>(observer => {
          observer.next(resenasTecnico);
          observer.complete();
        });
      })
    );
  }

  // Verificar si ya existe una reseña para un técnico y cliente específicos
  existeResena(tecnicoId: string, clienteId: string, cliente?: string): Observable<boolean> {
    return this.getResenas().pipe(
      map(resenas => {
        return resenas.some(resena => {
          // Verificar por clienteId (más confiable)
          if (resena.tecnicoId === tecnicoId && resena.clienteId === clienteId) {
            return true;
          }
          // Verificar por nombre del cliente como respaldo
          if (cliente && resena.tecnicoId === tecnicoId && resena.cliente === cliente) {
            return true;
          }
          return false;
        });
      })
    );
  }

  // Agregar una nueva reseña
  agregarResena(resena: Omit<Resena, 'id'>): Observable<Resena> {
    return this.getResenas().pipe(
      switchMap(resenas => {
        // Calcular el nuevo ID
        const nuevoId = resenas.length > 0 ?
          (Math.max(...resenas.map(r => +r.id)) + 1).toString() : '1';

        const nuevaResena: Resena = {
          ...resena,
          id: nuevoId
        };

        const resenasActualizadas = [...resenas, nuevaResena];

        return this.http.put<{mensaje: string}>(
          `${this.API_URL}/resenas`,
          resenasActualizadas
        ).pipe(
          switchMap(() => {
            return new Observable<Resena>(observer => {
              observer.next(nuevaResena);
              observer.complete();
            });
          })
        );
      })
    );
  }
}
