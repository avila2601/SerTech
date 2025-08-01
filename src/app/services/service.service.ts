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
        name: 'Preventive Maintenance',
        description: 'Service to ensure optimal performance of your appliances, extend lifespan, and prevent future breakdowns. Includes cleaning, technical inspection, and operational testing.',
        price: 50,
        estimatedDuration: 60,
        category: ServiceCategory.MAINTENANCE
      },
      {
        id: '2',
        name: 'Appliance Repair',
        description: 'Diagnostic visit to identify malfunctions and, if necessary, provide a quote for part replacements.',
        price: 80,
        estimatedDuration: 120,
        category: ServiceCategory.REPAIR
      },
      {
        id: '3',
        name: 'Installation and Configuration',
        description: 'Professional appliance installation, ensuring safe and functional connections. Includes proper mounting, leveling, and system startup verification.',
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
