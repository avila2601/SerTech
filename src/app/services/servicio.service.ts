import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Servicio, CategoriaServicio } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  private servicios: Servicio[] = [
    {
      id: '1',
      nombre: 'Mantenimiento Preventivo',
      descripcion: 'Limpieza y optimización del sistema',
      precio: 50,
      duracionEstimada: 60,
      categoria: CategoriaServicio.MANTENIMIENTO
    },
    {
      id: '2',
      nombre: 'Reparación de Hardware',
      descripcion: 'Reparación de componentes físicos',
      precio: 80,
      duracionEstimada: 120,
      categoria: CategoriaServicio.REPARACION
    },
    {
      id: '3',
      nombre: 'Instalación de Software',
      descripcion: 'Instalación y configuración de programas',
      precio: 40,
      duracionEstimada: 45,
      categoria: CategoriaServicio.INSTALACION
    },
    {
      id: '4',
      nombre: 'Diagnóstico de Problemas',
      descripcion: 'Identificación de fallas y problemas',
      precio: 30,
      duracionEstimada: 30,
      categoria: CategoriaServicio.DIAGNOSTICO
    }
  ];

  private serviciosSubject = new BehaviorSubject<Servicio[]>(this.servicios);

  constructor() {}

  getServicios(): Observable<Servicio[]> {
    return this.serviciosSubject.asObservable();
  }

  getServicioById(id: string): Servicio | undefined {
    return this.servicios.find(servicio => servicio.id === id);
  }

  getServiciosPorCategoria(categoria: CategoriaServicio): Observable<Servicio[]> {
    return new Observable(observer => {
      this.serviciosSubject.subscribe(servicios => {
        observer.next(servicios.filter(s => s.categoria === categoria));
      });
    });
  }
}
