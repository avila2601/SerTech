import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Service, ServiceCategory } from '../models';
import { ServicioData } from '../models/data-types';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  constructor() {}

  private mapServicioDataToService(ServicioData: ServicioData): Service {
    return {
      id: ServicioData.id,
      name: ServicioData.nombre,
      description: ServicioData.descripcion,
      price: ServicioData.precio,
      estimatedDuration: ServicioData.duracionEstimada,
      category: this.mapCategoryToEnglish(ServicioData.categoria)
    };
  }

  private mapCategoryToEnglish(categoria: string): ServiceCategory {
    // Map Spanish category strings to ServiceCategory enum
    switch (categoria) {
      case 'Mantenimiento':
        return ServiceCategory.MAINTENANCE;
      case 'Reparación':
        return ServiceCategory.REPAIR;
      case 'Instalación':
        return ServiceCategory.INSTALLATION;
      case 'Limpieza':
        return ServiceCategory.CLEANING;
      default:
        return ServiceCategory.MAINTENANCE;
    }
  }

  private mapCategoryToSpanish(category: ServiceCategory): ServiceCategory {
    // Since CategoriaServicioData is now an alias for ServiceCategory, direct return
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
    ] as ServicioData[]).pipe(
      map(ServicioData => ServicioData.map(ServicioData => this.mapServicioDataToService(ServicioData)))
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
  getServicioData(): Observable<ServicioData[]> {
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

  getServicioDataById(id: string): Observable<ServicioData | undefined> {
    return new Observable(observer => {
      this.getServicioData().subscribe(ServicioData => {
        observer.next(ServicioData.find(ServicioData => ServicioData.id === id));
        observer.complete();
      });
    });
  }

  getServicioDataPorCategoria(categoria: ServiceCategory): Observable<ServicioData[]> {
    return new Observable(observer => {
      this.getServicioData().subscribe(ServicioData => {
        observer.next(ServicioData.filter(s => s.categoria === categoria));
        observer.complete();
      });
    });
  }
}
