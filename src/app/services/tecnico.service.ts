import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Tecnico } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TecnicoService {
  private tecnicos: Tecnico[] = [
    {
      id: '1',
      nombre: 'Juan Pérez',
      especialidad: 'Electrodomésticos',
      calificacion: 4.7,
      disponible: true,
      foto: ''
    },
    {
      id: '2',
      nombre: 'María López',
      especialidad: 'Refrigeradores y Aires Acondicionados',
      calificacion: 4.9,
      disponible: true,
      foto: ''
    },
    {
      id: '3',
      nombre: 'Carlos Ramírez',
      especialidad: 'Lavadoras y Secadoras',
      calificacion: 4.5,
      disponible: false,
      foto: ''
    },
    // Técnicos adicionales
    {
      id: '4',
      nombre: 'Ana Torres',
      especialidad: 'Microondas y Hornos',
      calificacion: 4.8,
      disponible: true,
      foto: ''
    },
    {
      id: '5',
      nombre: 'Luis Fernández',
      especialidad: 'Televisores y Audio',
      calificacion: 4.6,
      disponible: true,
      foto: ''
    },
    {
      id: '6',
      nombre: 'Patricia Soto',
      especialidad: 'Pequeños electrodomésticos',
      calificacion: 4.4,
      disponible: false,
      foto: ''
    }
  ];

  private tecnicosSubject = new BehaviorSubject<Tecnico[]>(this.tecnicos);

  constructor() {}

  getTecnicos(): Observable<Tecnico[]> {
    return this.tecnicosSubject.asObservable();
  }

  getTecnicoById(id: string): Tecnico | undefined {
    return this.tecnicos.find(tecnico => tecnico.id === id);
  }

  getTecnicosDisponibles(): Observable<Tecnico[]> {
    return new Observable(observer => {
      this.tecnicosSubject.subscribe(tecnicos => {
        observer.next(tecnicos.filter(t => t.disponible));
      });
    });
  }

  actualizarDisponibilidad(id: string, disponible: boolean): boolean {
    const index = this.tecnicos.findIndex(t => t.id === id);
    if (index !== -1) {
      this.tecnicos[index].disponible = disponible;
      this.tecnicosSubject.next([...this.tecnicos]);
      return true;
    }
    return false;
  }
}
