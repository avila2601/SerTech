import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITechnicianRepository } from '../../domain/repositories/technician.repository';
import { Technician } from '../../domain/models/technician.model';

@Injectable({
  providedIn: 'root'
})
export class GetAllTechniciansUseCase {

  constructor(private technicianRepository: ITechnicianRepository) { }

  execute(): Observable<Technician[]> {
    return this.technicianRepository.getAll();
  }
}
