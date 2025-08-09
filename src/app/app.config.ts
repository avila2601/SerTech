import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { ITechnicianRepository } from './core/domain/repositories/technician.repository';
import { TechnicianJsonRepository } from './infrastructure/driven-adapters/json-repository/technician.json.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),

    // Clean Architecture providers
    { provide: ITechnicianRepository, useClass: TechnicianJsonRepository }
  ]
};
