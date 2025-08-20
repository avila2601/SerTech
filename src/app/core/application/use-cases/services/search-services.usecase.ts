import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Service } from '../../../domain/models/service.model';
import { ServiceRepository } from '../../../domain/repositories/service.repository';

@Injectable({
  providedIn: 'root'
})
export class SearchServicesUseCase {
  constructor(@Inject(ServiceRepository) private serviceRepository: ServiceRepository) {}

  execute(query: string): Observable<Service[]> {
    return this.serviceRepository.search(query);
  }
}
