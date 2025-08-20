import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface AppointmentValidationData {
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

@Injectable({
  providedIn: 'root'
})
export class ValidateAppointmentDataUseCase {

  execute(data: AppointmentValidationData): Observable<ValidationResult> {
    const errors: string[] = [];

    // Validate required service data
    if (!data.brand) {
      errors.push('La marca es requerida');
    }

    if (!data.location) {
      errors.push('La ubicación es requerida');
    }

    if (!data.date) {
      errors.push('La fecha es requerida');
    }

    if (!data.time) {
      errors.push('La hora es requerida');
    }

    if (!data.technicianId) {
      errors.push('El técnico es requerido');
    }

    if (!data.serviceId) {
      errors.push('El servicio es requerido');
    }

    // Validate personal data
    if (!data.name) {
      errors.push('El nombre es requerido');
    }

    if (!data.email) {
      errors.push('El email es requerido');
    } else if (!this.isValidEmail(data.email)) {
      errors.push('El email no tiene un formato válido');
    }

    if (!data.phone) {
      errors.push('El teléfono es requerido');
    }

    if (!data.address) {
      errors.push('La dirección es requerida');
    }

    // Note: Date validation removed to allow past dates for appointments

    return of({
      isValid: errors.length === 0,
      errors
    });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
