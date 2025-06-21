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
      nombre: 'Carlos Rodríguez',
      especialidad: 'Computadoras y Laptops',
      experiencia: 5,
      calificacion: 4.8,
      disponible: true,
      foto: 'assets/images/tecnico1.jpg'
    },
    {
      id: '2',
      nombre: 'María González',
      especialidad: 'Electrodomésticos',
      experiencia: 3,
      calificacion: 4.6,
      disponible: true,
      foto: 'assets/images/tecnico2.jpg'
    },
    {
      id: '3',
      nombre: 'Luis Martínez',
      especialidad: 'Aires Acondicionados',
      experiencia: 7,
      calificacion: 4.9,
      disponible: true,
      foto: 'assets/images/tecnico3.jpg'
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
