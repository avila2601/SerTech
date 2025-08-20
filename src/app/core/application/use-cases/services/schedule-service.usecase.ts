import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Service } from '../../../domain/models/service.model';

export interface ScheduleServiceParams {
  service?: Service;
  brand: string;
  product?: string;
  model?: string;
  location?: string;
  symptoms?: string;
  date?: string;
  time?: string;
  serviceIcon?: string;
}

export interface ScheduleServiceResult {
  isValid: boolean;
  navigationPath: string;
  queryParams: any;
  validationErrors?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ScheduleServiceUseCase {

  execute(params: ScheduleServiceParams): Observable<ScheduleServiceResult> {
    const validationErrors = this.validateParams(params);

    if (validationErrors.length > 0) {
      return of({
        isValid: false,
        navigationPath: '',
        queryParams: {},
        validationErrors
      });
    }

    const queryParams = this.buildQueryParams(params);

    return of({
      isValid: true,
      navigationPath: '/technicians',
      queryParams
    });
  }

  private validateParams(params: ScheduleServiceParams): string[] {
    const errors: string[] = [];

    if (!params.brand) {
      errors.push('Por favor selecciona una marca');
    }

    // Add more validations as needed
    // if (!params.product) {
    //   errors.push('Por favor selecciona un tipo de producto');
    // }
    // if (!params.location) {
    //   errors.push('Por favor selecciona tu ubicación');
    // }

    return errors;
  }

  private buildQueryParams(params: ScheduleServiceParams): any {
    return {
      service: params.service?.id,
      brand: params.brand,
      product: params.product,
      model: params.model,
      location: params.location,
      symptoms: params.symptoms,
      date: params.date,
      time: params.time
    };
  }
}
