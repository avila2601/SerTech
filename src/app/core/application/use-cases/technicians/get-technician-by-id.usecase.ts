import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Technician } from '../../../domain/models/technician.model';
import { ITechnicianRepository } from '../../../domain/repositories/technician.repository';

@Injectable({
  providedIn: 'root'
})
export class GetTechnicianByIdUseCase {
  constructor(private technicianRepository: ITechnicianRepository) {}

  execute(id: string): Observable<Technician | undefined> {
    return this.technicianRepository.getById(id);
  }
}
