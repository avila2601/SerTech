import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Service } from '../../../core/domain/models/service.model';
import { ServiceCategory } from '../../../models';
import { ServiceRepository } from '../../../core/domain/repositories/service.repository';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServiceJsonRepository extends ServiceRepository {

  constructor(private http: HttpClient) {
    super();
  }

  getAll(): Observable<Service[]> {
    // For now, return default services since we don't have a backend endpoint
    return of(this.getDefaultServices());
  }

  getById(id: string): Observable<Service | null> {
    return this.getAll().pipe(
      map(services => services.find(service => service.id === id) || null)
    );
  }

  getByCategory(category: ServiceCategory): Observable<Service[]> {
    return this.getAll().pipe(
      map(services => services.filter(service => service.category === category.toString()))
    );
  }

  create(service: Omit<Service, 'id'>): Observable<Service> {
    // For now, just simulate creation
    const newService: Service = {
      ...service,
      id: this.generateId()
    };
    return of(newService);
  }

  update(id: string, data: Partial<Service>): Observable<Service | null> {
    // For now, just simulate update
    return this.getById(id).pipe(
      map(service => service ? { ...service, ...data } : null)
    );
  }

  delete(id: string): Observable<boolean> {
    // For now, just simulate deletion
    return of(true);
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private getDefaultServices(): Service[] {
    return [
      {
        id: '1',
        name: 'Reparación',
        description: 'Servicio de reparación de electrodomésticos',
        price: 50000,
        estimatedDuration: 120,
        category: ServiceCategory.REPAIR
      },
      {
        id: '2',
        name: 'Mantenimiento',
        description: 'Servicio de mantenimiento preventivo',
        price: 30000,
        estimatedDuration: 90,
        category: ServiceCategory.MAINTENANCE
      },
      {
        id: '3',
        name: 'Instalación',
        description: 'Servicio de instalación de equipos',
        price: 40000,
        estimatedDuration: 180,
        category: ServiceCategory.INSTALLATION
      },
      {
        id: '4',
        name: 'Limpieza',
        description: 'Servicio de limpieza técnica',
        price: 25000,
        estimatedDuration: 60,
        category: ServiceCategory.CLEANING
      }
    ];
  }
}
