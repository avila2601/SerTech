import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { GetTechnicianByIdUseCase } from '../../core/application/use-cases/technicians/get-technician-by-id.usecase';
import {
  CreateAppointmentFromSummaryUseCase,
  ValidateAppointmentDataUseCase,
  GetCurrentUserAppointmentDataUseCase
} from '../../core/application/use-cases/appointments';
import { Technician } from '../../core/domain/models/technician.model';
import { UserStateService } from '../../core/application/services/user-state.service';

@Component({
  selector: 'app-appointment-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointment-summary.component.html',
  styleUrls: ['./appointment-summary.component.scss']
})
export class AppointmentSummaryComponent implements OnInit {
  // Service and personal data
  brand: string = '';
  product: string = '';
  model: string = '';
  symptoms: string = '';
  location: string = '';
  date: string = '';
  time: string = '';
  name: string = '';
  email: string = '';
  phone: string = '';
  address: string = '';
  isScheduling: boolean = false;
  technicianId: string = '';
  serviceId: string = '';

  // Technician information
  technician: Technician | null = null;

  // Use Cases
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly getTechnicianByIdUseCase = inject(GetTechnicianByIdUseCase);
  private readonly createAppointmentFromSummaryUseCase = inject(CreateAppointmentFromSummaryUseCase);
  private readonly validateAppointmentDataUseCase = inject(ValidateAppointmentDataUseCase);
  private readonly getCurrentUserAppointmentDataUseCase = inject(GetCurrentUserAppointmentDataUseCase);
  private readonly userStateService = inject(UserStateService);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.brand = params['brand'] || '';
      this.product = params['product'] || '';
      this.model = params['model'] || '';
      this.symptoms = params['symptoms'] || '';
      this.location = params['location'] || '';
      this.date = params['date'] || '';
      this.time = params['time'] || '';
      this.name = params['name'] || '';
      this.email = params['email'] || '';
      this.phone = params['phone'] || '';
      this.address = params['address'] || '';
      this.technicianId = params['technicianId'] || '';
      this.serviceId = params['serviceId'] || '';

      if (this.technicianId) {
        this.loadTechnicianData();
      }
    });
  }

  loadTechnicianData(): void {
    this.getTechnicianByIdUseCase.execute(this.technicianId).subscribe(technician => {
      if (technician) {
        this.technician = technician;
      }
    });
  }

  confirmAppointment(): void {
    if (this.isScheduling) return;

    // First validate the appointment data
    const appointmentData = {
      brand: this.brand,
      product: this.product,
      model: this.model,
      symptoms: this.symptoms,
      location: this.location,
      date: this.date,
      time: this.time,
      name: this.name,
      email: this.email,
      phone: this.phone,
      address: this.address,
      technicianId: this.technicianId,
      serviceId: this.serviceId
    };

    this.validateAppointmentDataUseCase.execute(appointmentData).subscribe({
      next: (validationResult) => {
        if (!validationResult.isValid) {
          alert(`Error de validación:\n${validationResult.errors.join('\n')}`);
          return;
        }

        this.isScheduling = true;

        this.createAppointmentFromSummaryUseCase.execute(appointmentData).subscribe({
          next: (result) => {
            this.handleAppointmentSuccess();
          },
          error: (error: any) => {
            console.error('Error creating appointment:', error);
            this.handleAppointmentError(error);
          }
        });
      },
      error: (error: any) => {
        console.error('Error validating appointment data:', error);
        alert('Error al validar los datos de la cita.');
      }
    });
  }

  private handleAppointmentSuccess() {
    alert('¡Cita agendada exitosamente!');

    // Get the logged client ID from UserStateService
    const loggedClientId = this.userStateService.getUserId();

    // Navigate to my-appointments with client parameter
    if (loggedClientId) {
      this.router.navigate(['/my-appointments'], {
        queryParams: { clientId: loggedClientId, fromAppointment: 'true' }
      });
    } else {
      this.router.navigate(['/my-appointments'], {
        queryParams: { fromAppointment: 'true' }
      });
    }
  }

  private handleAppointmentError(error: any) {
    console.error('Error scheduling appointment:', error);
    alert('Error al agendar la cita. Por favor, intenta de nuevo.');
    this.isScheduling = false;
  }  goBack(): void {
    this.router.navigate(['/clients'], {
      queryParams: {
        brand: this.brand,
        product: this.product,
        model: this.model,
        symptoms: this.symptoms,
        location: this.location,
        date: this.date,
        time: this.time,
        technicianId: this.technicianId,
        serviceId: this.serviceId
      }
    });
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
