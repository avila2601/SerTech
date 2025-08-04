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

  private mapCategoryToEnglish(categoria: ServiceCategory): ServiceCategory {
    // Since CategoriaServicio is now an alias for ServiceCategory, direct return
    return categoria;
  }

  private mapCategoryToSpanish(category: ServiceCategory): ServiceCategory {
    // Since CategoriaServicio is now an alias for ServiceCategory, direct return
    return category;
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
        categoria: ServiceCategory.MAINTENANCE
      },
      {
        id: '2',
        nombre: 'Reparación de Electrodomésticos',
        descripcion: 'Visita de diagnóstico para detectar fallas y si es necesario, cotizar el cambio de piezas.',
        precio: 80,
        duracionEstimada: 120,
        categoria: ServiceCategory.REPAIR
      },
      {
        id: '3',
        nombre: 'Instalación y Configuración',
        descripcion: 'Instalación profesional de electrodomésticos, asegurando una conexión segura y funcional. Verificación del correcto montaje, nivelación y puesta en marcha del equipo.',
        precio: 40,
        duracionEstimada: 90,
        categoria: ServiceCategory.INSTALLATION
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

  // Backward compatibility Spanish interface methods (deprecated)
  getServicios(): Observable<Servicio[]> {
    return of([
      {
        id: '1',
        nombre: 'Mantenimiento Preventivo',
        descripcion: 'Mantenimiento para asegurar el óptimo funcionamiento de tus electrodomésticos, prolongar su vida útil y prevenir futuras fallas. Incluye limpieza, revisión técnica y pruebas de operación.',
        precio: 50,
        duracionEstimada: 60,
        categoria: ServiceCategory.MAINTENANCE
      },
      {
        id: '2',
        nombre: 'Reparación de Electrodomésticos',
        descripcion: 'Visita de diagnóstico para detectar fallas y si es necesario, cotizar el cambio de piezas.',
        precio: 80,
        duracionEstimada: 120,
        categoria: ServiceCategory.REPAIR
      },
      {
        id: '3',
        nombre: 'Instalación y Configuración',
        descripcion: 'Instalación profesional de electrodomésticos, asegurando una conexión segura y funcional. Verificación del correcto montaje, nivelación y puesta en marcha del equipo.',
        precio: 40,
        duracionEstimada: 90,
        categoria: ServiceCategory.INSTALLATION
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

  getServiciosPorCategoria(categoria: ServiceCategory): Observable<Servicio[]> {
    return new Observable(observer => {
      this.getServicios().subscribe(servicios => {
        observer.next(servicios.filter(s => s.categoria === categoria));
        observer.complete();
      });
    });
  }
}
