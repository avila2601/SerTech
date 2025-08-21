import { AppointmentStatus } from '../../../models';

/**
 * Domain service for appointment status calculations
 * Contains business logic for determining appointment status
 */
export class AppointmentStatusCalculator {
  /**
   * Calculate appointment status based on date and time
   */
  static calculateStatus(fecha: string | Date, hora: string): AppointmentStatus {
    const appointmentDate = typeof fecha === 'string' ? new Date(fecha) : new Date(fecha);
    const [hours, minutes] = hora.split(':').map(Number);

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
