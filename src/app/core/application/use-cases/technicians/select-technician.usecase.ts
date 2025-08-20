import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ClientRepository } from '../../../domain/repositories/client.repository';
import { UserStateService } from '../../services/user-state.service';
import { UserType } from '../../../../models';

export interface TechnicianSelectionParams {
  technicianId: string;
  service?: string;
  brand?: string;
  product?: string;
  model?: string;
  location?: string;
  symptoms?: string;
  date?: string;
  time?: string;
}

export interface NavigationResult {
  route: string;
  params: any;
}

@Injectable({
  providedIn: 'root'
})
export class SelectTechnicianUseCase {

  constructor(
    private clientRepository: ClientRepository,
    private userStateService: UserStateService
  ) {}

  execute(selectionParams: TechnicianSelectionParams): Observable<NavigationResult> {
    const preservedParams: any = {
      technicianId: selectionParams.technicianId
    };

    // Preserve all form parameters
    if (selectionParams.service) {
      preservedParams.service = selectionParams.service;
      preservedParams.serviceId = selectionParams.service;
    }
    if (selectionParams.brand) preservedParams.brand = selectionParams.brand;
    if (selectionParams.product) preservedParams.product = selectionParams.product;
    if (selectionParams.model) preservedParams.model = selectionParams.model;
    if (selectionParams.location) preservedParams.location = selectionParams.location;
    if (selectionParams.symptoms) preservedParams.symptoms = selectionParams.symptoms;
    if (selectionParams.date) preservedParams.date = selectionParams.date;
    if (selectionParams.time) preservedParams.time = selectionParams.time;

    // Check if client is already logged in using UserStateService
    const currentUserState = this.userStateService.getCurrentUserState();

    if (currentUserState.isLoggedIn && currentUserState.userId && currentUserState.userType === UserType.CLIENT) {
      // Get client data to populate the summary
      return this.clientRepository.getById(currentUserState.userId).pipe(
        map((client) => {
          if (client) {
            // Add client data to params for appointment summary
            preservedParams.name = client.name;
            preservedParams.email = client.email;
            preservedParams.phone = client.phone;
            preservedParams.address = client.address;

            return {
              route: '/appointment-summary',
              params: preservedParams
            };
          } else {
            // If client not found, go to clients page
            return {
              route: '/clients',
              params: preservedParams
            };
          }
        })
      );
    } else {
      // Navigate to clients component
      return of({
        route: '/clients',
        params: preservedParams
      });
    }
  }
}
