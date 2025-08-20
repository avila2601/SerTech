import { Injectable, Inject } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppointmentRepository } from '../../../domain/repositories/appointment.repository';
import { ServiceRepository } from '../../../domain/repositories/service.repository';
import { ClientRepository } from '../../../domain/repositories/client.repository';
import { GetAllTechniciansUseCase } from '../technicians/get-all-technicians.usecase';
import { Appointment } from '../../../domain/models/appointment.model';
import { Service } from '../../../domain/models/service.model';
import { Client } from '../../../domain/models/client.model';
import { Technician } from '../../../domain/models/technician.model';

export interface AppointmentData {
  appointments: Appointment[];
  services: Service[];
  clients: Client[];
  technicians: Technician[];
}

@Injectable({
  providedIn: 'root'
})
export class LoadAppointmentDataUseCase {
  constructor(
    @Inject(AppointmentRepository) private appointmentRepository: AppointmentRepository,
    @Inject(ServiceRepository) private serviceRepository: ServiceRepository,
    @Inject(ClientRepository) private clientRepository: ClientRepository,
    private getAllTechniciansUseCase: GetAllTechniciansUseCase
  ) {}

  execute(): Observable<AppointmentData> {
    return forkJoin({
      appointments: this.appointmentRepository.getAll(),
      services: this.serviceRepository.getAll(),
      clients: this.clientRepository.getAll(),
      technicians: this.getAllTechniciansUseCase.execute()
    }).pipe(
      map(data => ({
        appointments: data.appointments || [],
        services: data.services || [],
        clients: data.clients || [],
        technicians: data.technicians || []
      }))
    );
  }
}
