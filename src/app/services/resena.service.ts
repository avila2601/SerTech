// DEPRECATED: This service has been consolidated into ReviewService
// Please use ReviewService instead
// All methods are available with both English and Spanish interfaces

import { Injectable } from '@angular/core';
import { ReviewService } from './review.service';

@Injectable({
  providedIn: 'root'
})
export class ResenaService extends ReviewService {
  // This service now extends ReviewService to maintain backward compatibility
  // All Spanish methods are available through the parent class
}
