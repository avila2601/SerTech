import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

export interface NavigationParams {
  brand: string;
  product: string;
  model: string;
  symptoms: string;
  location: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  technicianId: string;
  serviceId: string;
}

export interface NavigationResult {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NavigateToAppointmentSummaryUseCase {
  constructor(private router: Router) {}

  execute(params: NavigationParams): Observable<NavigationResult> {
    try {
      // Clean up appointment in process since we're moving to summary
      localStorage.removeItem('appointmentInProcess');

      this.router.navigate(['/appointment-summary'], {
        queryParams: {
          brand: params.brand,
          product: params.product,
          model: params.model,
          symptoms: params.symptoms,
          location: params.location,
          date: params.date,
          time: params.time,
          name: params.name,
          email: params.email,
          phone: params.phone,
          address: params.address,
          technicianId: params.technicianId,
          serviceId: params.serviceId
        }
      });

      return of({
        success: true,
        message: 'Navegación exitosa'
      });
    } catch (error) {
      console.error('Error navigating to appointment summary:', error);
      return of({
        success: false,
        message: 'Error en la navegación'
      });
    }
  }
}
