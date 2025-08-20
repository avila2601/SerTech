import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Service } from '../../../domain/models/service.model';
import { ServiceRepository } from '../../../domain/repositories/service.repository';

@Injectable({
  providedIn: 'root'
})
export class GetAllServicesUseCase {
  constructor(@Inject(ServiceRepository) private serviceRepository: ServiceRepository) {}

  execute(): Observable<Service[]> {
    return this.serviceRepository.getAll();
  }
}
