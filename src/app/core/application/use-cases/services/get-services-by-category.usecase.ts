import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Service } from '../../../domain/models/service.model';
import { ServiceCategory } from '../../../../models';
import { ServiceRepository } from '../../../domain/repositories/service.repository';

@Injectable({
  providedIn: 'root'
})
export class GetServicesByCategoryUseCase {
  constructor(@Inject(ServiceRepository) private serviceRepository: ServiceRepository) {}

  execute(category: ServiceCategory): Observable<Service[]> {
    return this.serviceRepository.getByCategory(category);
  }
}
