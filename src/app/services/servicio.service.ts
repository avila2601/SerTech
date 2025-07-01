import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Servicio, CategoriaServicio } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  constructor() {}

  getServicios(): Observable<Servicio[]> {
    return of([
      {
        id: '1',
        nombre: 'Mantenimiento Preventivo',
        descripcion: 'Mantenimiento para asegurar el óptimo funcionamiento de tus electrodomésticos, prolongar su vida útil y prevenir futuras fallas. Incluye limpieza, revisión técnica y pruebas de operación.',
        precio: 50,
        duracionEstimada: 60,
        categoria: CategoriaServicio.MANTENIMIENTO
      },
      {
        id: '2',
        nombre: 'Reparación de Electrodomésticos',
        descripcion: 'Visita de diagnóstico para detectar fallas y si es necesario, cotizar el cambio de piezas.',
        precio: 80,
        duracionEstimada: 120,
        categoria: CategoriaServicio.REPARACION
      },
      {
        id: '3',
        nombre: 'Instalación y Configuración',
        descripcion: 'Instalación profesional de electrodomésticos, asegurando una conexión segura y funcional. Verificación del correcto montaje, nivelación y puesta en marcha del equipo.',
        precio: 40,
        duracionEstimada: 90,
        categoria: CategoriaServicio.INSTALACION
      }
    ]);
  }

  getServicioById(id: string): Observable<Servicio | undefined> {
    return new Observable(observer => {
      this.getServicios().subscribe(servicios => {
        observer.next(servicios.find(servicio => servicio.id === id));
        observer.complete();
      });
    });
  }

  getServiciosPorCategoria(categoria: CategoriaServicio): Observable<Servicio[]> {
    return new Observable(observer => {
      this.getServicios().subscribe(servicios => {
        observer.next(servicios.filter(s => s.categoria === categoria));
        observer.complete();
      });
    });
  }
}
