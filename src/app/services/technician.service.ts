import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { Technician } from '../models';
import { ReviewService, Review } from './review.service';

// Temporary interface for reading Spanish data files
interface TecnicoData {
  id: string;
  nombre: string;
  especialidad: string;
  calificacion: number;
  disponible: boolean;
  foto?: string;
  contraseña: string;
}

@Injectable({
  providedIn: 'root'
})
export class TechnicianService {
  private url = 'assets/data/technicians.json';

  constructor(private http: HttpClient, private reviewService: ReviewService) {}

  // Primary English interface methods
  getTechnicians(): Observable<Technician[]> {
    return forkJoin({
      technicians: this.http.get<any[]>(this.url).pipe(
        map(tecnicos => tecnicos.map(t => ({
          id: t.id,
          name: t.nombre,
          specialty: t.especialidad,
          available: t.disponible,
          rating: t.calificacion,
          photo: t.foto,
          password: t.contraseña
        } as Technician)))
      ),
      reviews: this.reviewService.getAllReviews()
    }).pipe(
      map(({ technicians, reviews }) => {
        return technicians.map(technician => {
          const reviewsForTechnician = reviews.filter(review => review.technicianId === technician.id);
          if (reviewsForTechnician.length > 0) {
            const totalRating = reviewsForTechnician.reduce((acc, review) => acc + review.rating, 0);
            const averageRating = totalRating / reviewsForTechnician.length;
            technician.rating = parseFloat(averageRating.toFixed(1));
          } else {
            technician.rating = 0;
          }
          return technician;
        });
      })
    );
  }

  getTechnicianById(id: string): Observable<Technician | undefined> {
    return new Observable(observer => {
      this.getTechnicians().subscribe(technicians => {
        observer.next(technicians.find(technician => technician.id === id));
        observer.complete();
      });
    });
  }

  getAvailableTechnicians(): Observable<Technician[]> {
    return new Observable(observer => {
      this.getTechnicians().subscribe(technicians => {
        observer.next(technicians.filter((tech: Technician) => tech.available));
        observer.complete();
      });
    });
  }
}
