import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { ITechnicianRepository } from './core/domain/repositories/technician.repository';
import { TechnicianJsonRepository } from './infrastructure/driven-adapters/json-repository/technician.json.repository';
import { IReviewRepository } from './core/domain/repositories/review.repository';
import { ReviewJsonRepository } from './infrastructure/driven-adapters/json-repository/review.json.repository';
import { ClientRepository } from './core/domain/repositories/client.repository';
import { ClientJsonRepository } from './infrastructure/driven-adapters/json-repository/client.json.repository';
import { AppointmentRepository } from './core/domain/repositories/appointment.repository';
import { AppointmentJsonRepository } from './infrastructure/driven-adapters/json-repository/appointment.json.repository';
import { ServiceRepository } from './core/domain/repositories/service.repository';
import {
  ServiceJsonRepository,
  StorageClientRepository,
  StorageAppointmentRepository
} from './infrastructure/driven-adapters';
import {
  ClientStorageRepository,
  AppointmentStorageRepository
} from './core/domain/repositories/storage';
import { CalculateAppointmentStatusUseCase } from './core/application/use-cases/appointments';
import { SelectTechnicianUseCase } from './core/application/use-cases/technicians';
import {
  GetAllServicesUseCase,
  GetServicesByCategoryUseCase,
  GetServiceByIdUseCase,
  MapServiceTypeToCategoryUseCase,
  ScheduleServiceUseCase
} from './core/application/use-cases/services';
import {
  CreateAppointmentFromSummaryUseCase,
  ValidateAppointmentDataUseCase,
  GetCurrentUserAppointmentDataUseCase,
  LoadAppointmentDataUseCase,
  FilterAppointmentsByUserUseCase,
  GetAppointmentDisplayDataUseCase
} from './core/application/use-cases/appointments';
import {
  UpdateClientInformationUseCase,
  LoadClientFormDataUseCase,
  NavigateToAppointmentSummaryUseCase,
  AuthenticateClientUseCase,
  HandleLoginSuccessUseCase
} from './core/application/use-cases/clients';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),

    // Clean Architecture providers
    { provide: ITechnicianRepository, useClass: TechnicianJsonRepository },
    { provide: IReviewRepository, useClass: ReviewJsonRepository },
    { provide: ClientRepository, useClass: ClientJsonRepository },
    { provide: AppointmentRepository, useClass: AppointmentJsonRepository },
    { provide: ServiceRepository, useClass: ServiceJsonRepository },

    // Storage repositories
    { provide: ClientStorageRepository, useClass: StorageClientRepository },
    { provide: AppointmentStorageRepository, useClass: StorageAppointmentRepository },

    // Use Cases
    CalculateAppointmentStatusUseCase,
    SelectTechnicianUseCase,
    GetAllServicesUseCase,
    GetServicesByCategoryUseCase,
    GetServiceByIdUseCase,
    MapServiceTypeToCategoryUseCase,
    ScheduleServiceUseCase,
    CreateAppointmentFromSummaryUseCase,
    ValidateAppointmentDataUseCase,
    GetCurrentUserAppointmentDataUseCase,
    UpdateClientInformationUseCase,
    LoadClientFormDataUseCase,
    NavigateToAppointmentSummaryUseCase,
    LoadAppointmentDataUseCase,
    FilterAppointmentsByUserUseCase,
    GetAppointmentDisplayDataUseCase,
    AuthenticateClientUseCase,
    HandleLoginSuccessUseCase
  ]
};

