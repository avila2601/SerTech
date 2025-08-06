import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, map } from 'rxjs';

// English interface for reviews
export interface Review {
  id: string;
  technicianId: string;
  clientId: string;
  clientName: string;
  comment: string;
  rating: number;
  date: string;
}

// Spanish interface for backward compatibility
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
export class ReviewService {
  private readonly API_URL = 'https://sertech-backend.onrender.com';

  constructor(private http: HttpClient) {}

  // English interface methods
  private mapResenaToReview(resena: Resena): Review {
    return {
      id: resena.id,
      technicianId: resena.tecnicoId,
      clientId: resena.clienteId,
      clientName: resena.cliente,
      comment: resena.comentario,
      rating: resena.calificacion,
      date: resena.fecha
    };
  }

  private mapReviewToResena(review: Partial<Review>): Partial<Resena> {
    const resena: Partial<Resena> = {};
    if (review.id) resena.id = review.id;
    if (review.technicianId) resena.tecnicoId = review.technicianId;
    if (review.clientId) resena.clienteId = review.clientId;
    if (review.clientName) resena.cliente = review.clientName;
    if (review.comment) resena.comentario = review.comment;
    if (review.rating) resena.calificacion = review.rating;
    if (review.date) resena.fecha = review.date;
    return resena;
  }

  getReviews(): Observable<Review[]> {
    return this.http.get<Resena[]>(`${this.API_URL}/resenas`).pipe(
      map(resenas => resenas.map(resena => this.mapResenaToReview(resena)))
    );
  }

  getAllReviews(): Observable<Review[]> {
    return this.getReviews();
  }

  getReviewsByTechnician(technicianId: string): Observable<Review[]> {
    return this.getReviews().pipe(
      switchMap(reviews => {
        const technicianReviews = reviews.filter(review => review.technicianId === technicianId);
        return new Observable<Review[]>(observer => {
          observer.next(technicianReviews);
          observer.complete();
        });
      })
    );
  }

  reviewExists(technicianId: string, clientId: string, clientName?: string): Observable<boolean> {
    return this.getReviews().pipe(
      map(reviews => {
        return reviews.some(review => {
          // Check by clientId (more reliable)
          if (review.technicianId === technicianId && review.clientId === clientId) {
            return true;
          }
          // Check by client name as fallback
          if (clientName && review.technicianId === technicianId && review.clientName === clientName) {
            return true;
          }
          return false;
        });
      })
    );
  }

  addReview(review: Omit<Review, 'id'>): Observable<Review> {
    return this.getResenas().pipe(
      switchMap(resenas => {
        // Calculate new ID
        const newId = resenas.length > 0 ?
          (Math.max(...resenas.map(r => +r.id)) + 1).toString() : '1';

        const newResena: Resena = {
          id: newId,
          tecnicoId: review.technicianId,
          clienteId: review.clientId,
          cliente: review.clientName,
          comentario: review.comment,
          calificacion: review.rating,
          fecha: review.date
        };

        const updatedResenas = [...resenas, newResena];

        return this.http.put<{mensaje: string}>(
          `${this.API_URL}/resenas`,
          updatedResenas
        ).pipe(
          switchMap(() => {
            return new Observable<Review>(observer => {
              observer.next(this.mapResenaToReview(newResena));
              observer.complete();
            });
          })
        );
      })
    );
  }

  // Backward compatibility Spanish interface methods (deprecated)
  getResenas(): Observable<Resena[]> {
    return this.http.get<Resena[]>(`${this.API_URL}/resenas`);
  }

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
