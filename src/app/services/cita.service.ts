// DEPRECATED: This service has been consolidated into AppointmentService
// Please use AppointmentService instead
// All methods are available with both English and Spanish interfaces

import { Injectable } from '@angular/core';
import { AppointmentService } from './appointment.service';

@Injectable({
  providedIn: 'root'
})
export class CitaService extends AppointmentService {
  // This service now extends AppointmentService to maintain backward compatibility
  // All Spanish methods are available through the parent class
}
