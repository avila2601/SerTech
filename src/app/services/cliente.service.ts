// DEPRECATED: This service has been consolidated into ClientService
// Please use ClientService instead
// All methods are available with both English and Spanish interfaces

import { Injectable } from '@angular/core';
import { ClientService } from './client.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService extends ClientService {
  // This service now extends ClientService to maintain backward compatibility
  // All Spanish methods are available through the parent class
}
