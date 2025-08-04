// DEPRECATED: This service has been consolidated into ServiceService
// Please use ServiceService instead
// All methods are available with both English and Spanish interfaces

import { Injectable } from '@angular/core';
import { ServiceService } from './service.service';

@Injectable({
  providedIn: 'root'
})
export class ServicioService extends ServiceService {
  // This service now extends ServiceService to maintain backward compatibility
  // All Spanish methods are available through the parent class
}
