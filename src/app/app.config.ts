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
import { CalculateAppointmentStatusUseCase } from './core/application/use-cases/appointments';

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

    // Use Cases
    CalculateAppointmentStatusUseCase
  ]
};
