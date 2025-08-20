import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Service, ServiceCategory } from '../models';
import {
  GetAllServicesUseCase,
  GetServiceByIdUseCase,
  GetServicesByCategoryUseCase
} from '../core/application/use-cases/services';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  // Use Cases - Clean Architecture
  private readonly getAllServicesUseCase = inject(GetAllServicesUseCase);
  private readonly getServiceByIdUseCase = inject(GetServiceByIdUseCase);
  private readonly getServicesByCategoryUseCase = inject(GetServicesByCategoryUseCase);

  constructor() {}

  // Clean Architecture methods - Primary interface
  getServices(): Observable<Service[]> {
    return this.getAllServicesUseCase.execute();
  }

  getServiceById(id: string): Observable<Service | undefined> {
    return this.getServiceByIdUseCase.execute(id).pipe(
      map(service => service ?? undefined)
    );
  }

  getServicesByCategory(category: ServiceCategory): Observable<Service[]> {
    return this.getServicesByCategoryUseCase.execute(category);
  }
}
