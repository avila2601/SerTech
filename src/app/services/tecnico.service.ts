// DEPRECATED: This service has been consolidated into TechnicianService
// Please use TechnicianService instead
// All methods are available with both English and Spanish interfaces

import { Injectable } from '@angular/core';
import { TechnicianService } from './technician.service';

@Injectable({
  providedIn: 'root'
})
export class TecnicoService extends TechnicianService {
  // This service now extends TechnicianService to maintain backward compatibility
  // All Spanish methods are available through the parent class
}
