import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tecnico } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TecnicoService {
  private url = 'assets/data/tecnicos.json';

  constructor(private http: HttpClient) {}

  getTecnicos(): Observable<Tecnico[]> {
    return this.http.get<Tecnico[]>(this.url);
  }

  getTecnicoById(id: string): Observable<Tecnico | undefined> {
    return new Observable(observer => {
      this.getTecnicos().subscribe(tecnicos => {
        observer.next(tecnicos.find(tecnico => tecnico.id === id));
        observer.complete();
      });
    });
  }

  getTecnicosDisponibles(): Observable<Tecnico[]> {
    return new Observable(observer => {
      this.getTecnicos().subscribe(tecnicos => {
        observer.next(tecnicos.filter((t: Tecnico) => t.disponible));
        observer.complete();
      });
    });
  }
}
