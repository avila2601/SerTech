import { AppointmentStatus } from '../../../models';

/**
 * Domain service for appointment status calculations
 * Contains business logic for determining appointment status
 */
export class AppointmentStatusCalculator {
  /**
   * Calculate appointment status based on date and time
   */
  static calculateStatus(fecha: string, hora: string): AppointmentStatus {
    const now = new Date();
    const appointmentDate = new Date(`${fecha}T${hora}`);

    if (appointmentDate < now) {
      return AppointmentStatus.COMPLETED;
    } else if (appointmentDate > now) {
      return AppointmentStatus.CONFIRMED;
    } else {
      return AppointmentStatus.IN_PROGRESS;
    }
  }
}
