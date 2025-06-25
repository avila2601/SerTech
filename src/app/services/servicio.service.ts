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
      descripcion: 'Revisión, limpieza y ajuste el equipo para evitar fallas y prolongar su vida útil.',
      precio: 50,
      duracionEstimada: 60,
      categoria: CategoriaServicio.MANTENIMIENTO
    },
    {
      id: '2',
      nombre: 'Reparación de tu equipo',
      descripcion: 'Corrección de fallas o daños para restaurar su funcionamiento normal (en caso de requerirse cambio de piezas te las cotizamos).',
      precio: 80,
      duracionEstimada: 120,
      categoria: CategoriaServicio.REPARACION
    },
    {
      id: '3',
      nombre: 'Instalación de equipos',
      descripcion: 'Instalación, configuración y puesta en funcionamiento de tu equipo.',
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
