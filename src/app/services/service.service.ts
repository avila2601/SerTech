import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Service, ServiceCategory, Servicio, CategoriaServicio } from '../models';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  constructor() {}

  private mapServicioToService(servicio: Servicio): Service {
    return {
      id: servicio.id,
      name: servicio.nombre,
      description: servicio.descripcion,
      price: servicio.precio,
      estimatedDuration: servicio.duracionEstimada,
      category: this.mapCategoryToEnglish(servicio.categoria)
    };
  }

  private mapCategoryToEnglish(categoria: CategoriaServicio): ServiceCategory {
    switch (categoria) {
      case CategoriaServicio.MANTENIMIENTO:
        return ServiceCategory.MAINTENANCE;
      case CategoriaServicio.REPARACION:
        return ServiceCategory.REPAIR;
      case CategoriaServicio.INSTALACION:
        return ServiceCategory.INSTALLATION;
      case CategoriaServicio.LIMPIEZA:
        return ServiceCategory.CLEANING;
      default:
        return ServiceCategory.MAINTENANCE;
    }
  }

  private mapCategoryToSpanish(category: ServiceCategory): CategoriaServicio {
    switch (category) {
      case ServiceCategory.MAINTENANCE:
        return CategoriaServicio.MANTENIMIENTO;
      case ServiceCategory.REPAIR:
        return CategoriaServicio.REPARACION;
      case ServiceCategory.INSTALLATION:
        return CategoriaServicio.INSTALACION;
      case ServiceCategory.CLEANING:
        return CategoriaServicio.LIMPIEZA;
      default:
        return CategoriaServicio.MANTENIMIENTO;
    }
  }

  getServices(): Observable<Service[]> {
    // Use Spanish service data and map to English interface
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
    ] as Servicio[]).pipe(
      map(servicios => servicios.map(servicio => this.mapServicioToService(servicio)))
    );
  }

  getServiceById(id: string): Observable<Service | undefined> {
    return new Observable(observer => {
      this.getServices().subscribe(services => {
        observer.next(services.find(service => service.id === id));
        observer.complete();
      });
    });
  }

  getServicesByCategory(category: ServiceCategory): Observable<Service[]> {
    return new Observable(observer => {
      this.getServices().subscribe(services => {
        observer.next(services.filter(s => s.category === category));
        observer.complete();
      });
    });
  }
}
