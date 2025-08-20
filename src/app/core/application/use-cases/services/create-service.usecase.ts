import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Service } from '../../../domain/models/service.model';
import { ServiceRepository } from '../../../domain/repositories/service.repository';

@Injectable({
  providedIn: 'root'
})
export class CreateServiceUseCase {
  constructor(@Inject(ServiceRepository) private serviceRepository: ServiceRepository) {}

  execute(service: Omit<Service, 'id'>): Observable<Service> {
    return this.serviceRepository.create(service);
  }
}
