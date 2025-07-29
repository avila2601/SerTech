import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map } from 'rxjs';

export interface Resena {
  id: string;
  tecnicoId: string;
  clienteId?: string;
  cliente: string;
  comentario: string;
  calificacion: number;
  fecha: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly API_URL = 'https://sertech-backend.onrender.com';

  constructor(private http: HttpClient) {}

  getResenas(): Observable<Resena[]> {
    return this.http.get<Resena[]>(`${this.API_URL}/resenas`);
  }

  getResenasPorTecnico(tecnicoId: string): Observable<Resena[]> {
    return this.getResenas().pipe(
      map(resenas => resenas.filter(r => r.tecnicoId === tecnicoId))
    );
  }

  agregarResena(resena: Omit<Resena, 'id'>): Observable<Resena> {
    return this.getResenas().pipe(
      map(resenas => {
        const nuevoId = resenas.length > 0
          ? (Math.max(...resenas.map(r => parseInt(r.id))) + 1).toString()
          : '1';

        const nuevaResena: Resena = {
          ...resena,
          id: nuevoId
        };

        const resenasActualizadas = [...resenas, nuevaResena];

        this.http.put(`${this.API_URL}/resenas`, resenasActualizadas)
          .subscribe();

        return nuevaResena;
      })
    );
  }

  existeResena(tecnicoId: string, clienteId: string, clienteNombre: string): Observable<boolean> {
    return this.getResenas().pipe(
      map(resenas => {
        return resenas.some(r =>
          r.tecnicoId === tecnicoId &&
          (r.clienteId === clienteId || r.cliente === clienteNombre)
        );
      })
    );
  }
}
