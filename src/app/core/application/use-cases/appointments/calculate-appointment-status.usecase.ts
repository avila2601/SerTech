import { Injectable } from '@angular/core';
import { AppointmentStatus } from '../../../../models';

@Injectable({
  providedIn: 'root'
})
export class CalculateAppointmentStatusUseCase {

  execute(date: Date, time: string): AppointmentStatus {
    const appointmentDate = new Date(date);
    const [hours, minutes] = time.split(':').map(Number);

    // Crear fecha completa con hora y minutos
    const appointmentDateTime = new Date(appointmentDate);
    appointmentDateTime.setHours(hours, minutes, 0, 0);

    const currentDateTime = new Date();

    // Si la fecha y hora ya pasaron, está terminada
    if (appointmentDateTime < currentDateTime) {
      return AppointmentStatus.COMPLETED;
    }
    return AppointmentStatus.PENDING;
  }
}
