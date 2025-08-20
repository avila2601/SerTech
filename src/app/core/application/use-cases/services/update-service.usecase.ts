import { Injectable, Inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Service } from '../../../domain/models/service.model';
import { ServiceRepository } from '../../../domain/repositories/service.repository';

@Injectable({
  providedIn: 'root'
})
export class UpdateServiceUseCase {
  constructor(@Inject('ServiceRepository') private serviceRepository: ServiceRepository) {}

  execute(id: string, service: Partial<Service>): Observable<Service> {
    return this.serviceRepository.update(id, service).pipe(
      switchMap(result => {
        if (result === null) {
          return throwError(() => new Error(`Service with id ${id} not found`));
        }
        return [result];
      })
    );
  }
}
