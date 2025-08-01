import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Service, ServiceCategory } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  constructor() {}

  getServices(): Observable<Service[]> {
    return of<Service[]>([
      {
        id: '1',
        name: 'Mantenimiento Preventivo',
        description: 'Servicio para asegurar el rendimiento óptimo de tus electrodomésticos, extender su vida útil y prevenir futuras averías. Incluye limpieza, inspección técnica y prueba de funcionamiento.',
        price: 50,
        estimatedDuration: 60,
        category: ServiceCategory.MAINTENANCE
      },
      {
        id: '2',
        name: 'Reparación de Electrodomésticos',
        description: 'Visita de diagnóstico para identificar fallos y, si es necesario, proporcionar un presupuesto para el reemplazo de piezas.',
        price: 80,
        estimatedDuration: 120,
        category: ServiceCategory.REPAIR
      },
      {
        id: '3',
        name: 'Instalación y Configuración',
        description: 'Instalación profesional de electrodomésticos, garantizando conexiones seguras y funcionales. Incluye montaje, nivelación adecuada y verificación de arranque del sistema.',
        price: 40,
        estimatedDuration: 90,
        category: ServiceCategory.INSTALLATION
      }
    ]);
  }

  getServiceById(id: string): Observable<Service | undefined> {
    return new Observable<Service | undefined>(observer => {
      this.getServices().subscribe(list => {
        observer.next(list.find(s => s.id === id));
        observer.complete();
      });
    });
  }

  getServicesByCategory(category: ServiceCategory): Observable<Service[]> {
    return new Observable<Service[]>(observer => {
      this.getServices().subscribe(list => {
        observer.next(list.filter(s => s.category === category));
        observer.complete();
      });
    });
  }
}
