import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Service } from '../../../core/domain/models/service.model';
import { ServiceRepository } from '../../../core/domain/repositories/service.repository';
import { ServiceCategory } from '../../../models';

@Injectable({
  providedIn: 'root'
})
export class ServiceStaticRepository extends ServiceRepository {

  private staticServices: Service[] = [
    {
      id: '1',
      name: 'Mantenimiento Preventivo',
      description: 'Mantenimiento para asegurar el óptimo funcionamiento de tus electrodomésticos, prolongar su vida útil y prevenir futuras fallas. Incluye limpieza, revisión técnica y pruebas de operación.',
      price: 50,
      estimatedDuration: 60,
      category: ServiceCategory.MAINTENANCE
    },
    {
      id: '2',
      name: 'Reparación de Electrodomésticos',
      description: 'Visita de diagnóstico para detectar fallas y si es necesario, cotizar el cambio de piezas.',
      price: 80,
      estimatedDuration: 120,
      category: ServiceCategory.REPAIR
    },
    {
      id: '3',
      name: 'Instalación y Configuración',
      description: 'Instalación profesional de electrodomésticos, asegurando una conexión segura y funcional. Verificación del correcto montaje, nivelación y puesta en marcha del equipo.',
      price: 40,
      estimatedDuration: 90,
      category: ServiceCategory.INSTALLATION
    }
  ];

  constructor() {
    super();
  }

  getAll(): Observable<Service[]> {
    return of([...this.staticServices]);
  }

  getById(id: string): Observable<Service | null> {
    const service = this.staticServices.find(s => s.id === id);
    return of(service || null);
  }

  getByCategory(category: ServiceCategory): Observable<Service[]> {
    const filteredServices = this.staticServices.filter(s => s.category === category);
    return of(filteredServices);
  }

  create(service: Omit<Service, 'id'>): Observable<Service> {
    const newId = (this.staticServices.length + 1).toString();
    const newService: Service = {
      ...service,
      id: newId
    };
    this.staticServices.push(newService);
    return of(newService);
  }

  update(id: string, data: Partial<Service>): Observable<Service | null> {
    const index = this.staticServices.findIndex(s => s.id === id);
    if (index === -1) {
      return of(null);
    }

    this.staticServices[index] = { ...this.staticServices[index], ...data };
    return of(this.staticServices[index]);
  }

  delete(id: string): Observable<boolean> {
    const index = this.staticServices.findIndex(s => s.id === id);
    if (index === -1) {
      return of(false);
    }

    this.staticServices.splice(index, 1);
    return of(true);
  }

  search(query: string): Observable<Service[]> {
    const lowerQuery = query.toLowerCase();
    const filteredServices = this.staticServices.filter(service =>
      service.name.toLowerCase().includes(lowerQuery) ||
      service.description.toLowerCase().includes(lowerQuery)
    );
    return of(filteredServices);
  }
}
