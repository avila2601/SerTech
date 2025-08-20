import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface UserAppointmentData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

@Injectable({
  providedIn: 'root'
})
export class GetCurrentUserAppointmentDataUseCase {

  execute(): Observable<UserAppointmentData> {
    const data: UserAppointmentData = {
      name: localStorage.getItem('appointmentData.personalInfo.name') || '',
      email: localStorage.getItem('appointmentData.personalInfo.email') || '',
      phone: localStorage.getItem('appointmentData.personalInfo.phone') || '',
      address: localStorage.getItem('appointmentData.personalInfo.address') || ''
    };

    return of(data);
  }
}
