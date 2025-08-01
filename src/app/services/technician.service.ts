import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject, map } from 'rxjs';
import { Technician } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TechnicianService {
  // Remove external API, always load from local JSON
  private technicians: Technician[] = [];
  private techniciansSubject = new BehaviorSubject<Technician[]>([]);

  constructor(private http: HttpClient) {
    this.loadTechnicians();
  }

  loadTechnicians() {
    // Load technicians from local JSON file
    this.http.get<Technician[]>('assets/data/technicians.json').subscribe({
      next: (techs) => {
        this.technicians = techs;
        this.techniciansSubject.next(this.technicians);
      },
      error: (error) => {
        console.error('Error loading technicians from local JSON:', error);
      }
    });
  }

  getTechnicians(): Observable<Technician[]> {
    if (this.technicians.length > 0) {
      return of(this.technicians);
    }
    return this.techniciansSubject.asObservable();
  }

  getTechnicianById(id: string): Observable<Technician | undefined> {
    if (this.technicians.length > 0) {
      return of(this.technicians.find(tech => tech.id === id));
    }
    return this.techniciansSubject.asObservable().pipe(
      map(techs => techs.find(tech => tech.id === id))
    );
  }

  getTechniciansBySpecialty(specialty: string): Observable<Technician[]> {
    return this.getTechnicians().pipe(
      map(techs => techs.filter(tech =>
        tech.specialty.toLowerCase().includes(specialty.toLowerCase())))
    );
  }

  // Método para actualizar calificación de un técnico
  updateRating(technicianId: string, rating: number): Observable<void> {
    return this.getTechnicianById(technicianId).pipe(
        map(tech => {
        if (tech) {
          tech.rating = rating;
          this.techniciansSubject.next(this.technicians);
        }
        return;
      })
    );
  }

  authenticateTechnician(id: string, password: string): Observable<boolean> {
    return this.getTechnicians().pipe(
      map(techs => {
        const tech = techs.find(t => t.id === id && t.password === password);
        return !!tech;
      })
    );
  }
}
