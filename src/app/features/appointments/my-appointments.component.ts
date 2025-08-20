import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import {
  LoadAppointmentDataUseCase,
  FilterAppointmentsByUserUseCase,
  GetAppointmentDisplayDataUseCase
} from '../../core/application/use-cases/appointments';
import { CheckReviewExistsUseCase } from '../../core/application/use-cases/reviews/check-review-exists.usecase';
import { Appointment, Service, Client } from '../../models';
import { Technician } from '../../core/domain/models/technician.model';
import { ReviewsComponent } from '../../features/reviews/reviews.component';

@Component({
  selector: 'app-my-appointments',
  standalone: true,
  imports: [CommonModule, ReviewsComponent],
  templateUrl: './my-appointments.component.html',
  styleUrls: ['./my-appointments.component.scss']
})
export class MyAppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  services: Service[] = [];
  technicians: Technician[] = [];
  clients: Client[] = [];
  currentClientId: string | null = null;
  currentTechnicianId: string | null = null;
  showReviewModal = false;
  reviewTechnicianId = '';
  reviewClientId = '';
  reviewClientName = '';
  reviewAppointmentId = '';
  evaluatedAppointments: Set<string> = new Set();
  currentFilter: 'ALL' | 'PENDING' | 'COMPLETED' = 'ALL';

  // Use Cases
  private readonly loadAppointmentDataUseCase = inject(LoadAppointmentDataUseCase);
  private readonly filterAppointmentsByUserUseCase = inject(FilterAppointmentsByUserUseCase);
  private readonly getAppointmentDisplayDataUseCase = inject(GetAppointmentDisplayDataUseCase);
  private readonly checkReviewExistsUseCase = inject(CheckReviewExistsUseCase);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['clientId']) {
        this.currentClientId = params['clientId'];
        this.currentTechnicianId = null;
      } else if (params['technicianId']) {
        this.currentTechnicianId = params['technicianId'];
        this.currentClientId = null;
      } else {
        const loggedClientId = localStorage.getItem('loggedClient');
        const loggedTechnicianId = localStorage.getItem('loggedTechnician');
        const emailLogin = localStorage.getItem('emailLogin');

        if (loggedClientId) {
          this.currentClientId = loggedClientId;
          this.currentTechnicianId = null;
        } else if (loggedTechnicianId) {
          this.currentTechnicianId = loggedTechnicianId;
          this.currentClientId = null;
        } else if (emailLogin) {
          this.currentClientId = null;
          this.currentTechnicianId = null;
        }
      }

      // Si viene de crear una cita, agregar un pequeño delay para permitir sincronización
      if (params['fromAppointment'] === 'true') {
        setTimeout(() => {
          this.loadData();
        }, 1500); // 1.5 segundos de delay
      } else {
        this.loadData();
      }
    });
  }

  loadData(): void {
    this.loadAppointmentDataUseCase.execute().subscribe({
      next: (data) => {
        this.appointments = data.appointments;
        this.services = data.services;
        this.technicians = data.technicians;
        this.clients = data.clients;
        this.filterAppointments();
        // Execute checkEvaluatedAppointments AFTER filtering
        this.checkEvaluatedAppointments();
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.appointments = [];
        this.services = [];
        this.technicians = [];
        this.clients = [];
        this.filteredAppointments = [];
      }
    });
  }

  setFilter(filter: 'ALL' | 'PENDING' | 'COMPLETED'): void {
    this.currentFilter = filter;
    this.filterAppointments();
    // Verificar reseñas después de filtrar
    this.checkEvaluatedAppointments();
  }

  filterAppointments(): void {
    this.filterAppointmentsByUserUseCase.execute({
      appointments: this.appointments,
      clients: this.clients,
      currentClientId: this.currentClientId,
      currentTechnicianId: this.currentTechnicianId,
      filterType: this.currentFilter
    }).subscribe({
      next: (result) => {
        this.filteredAppointments = result.filteredAppointments;
      },
      error: (error) => {
        console.error('Error filtering appointments:', error);
        this.filteredAppointments = [];
      }
    });
  }

  checkEvaluatedAppointments(): void {
    this.filteredAppointments.forEach(appointment => {
      if (this.getAppointmentStatus(appointment) === 'Terminada') {
        this.checkReviewExistsUseCase.execute(appointment.id).subscribe({
          next: (exists) => {
            if (exists) {
              this.evaluatedAppointments.add(appointment.id);
            }
          },
          error: (error) => {
            console.error(`Error checking review exists for appointment ${appointment.id}:`, error);
          }
        });
      }
    });
  }

  getServiceName(serviceId: string): string {
    const service = this.services.find(s => s.id === serviceId);
    return service ? service.name : 'Servicio no encontrado';
  }

  getTechnicianName(technicianId: string): string {
    const technician = this.technicians.find(t => t.id === technicianId);
    return technician ? technician.name : 'No asignado';
  }

  getTechnicianSpecialty(technicianId: string): string {
    const technician = this.technicians.find(t => t.id === technicianId);
    return technician ? technician.specialty : 'No asignado';
  }

  getTechnicianRating(technicianId: string): number {
    const technician = this.technicians.find(t => t.id === technicianId);
    return technician ? technician.rating : 0;
  }

  getClientName(clientId: string): string {
    const client = this.clients.find(c => c.id === clientId);
    return client ? client.name : 'No disponible';
  }

  getClientEmail(clientId: string): string {
    const client = this.clients.find(c => c.id === clientId);
    return client ? client.email : 'No disponible';
  }

  getClientPhone(clientId: string): string {
    const client = this.clients.find(c => c.id === clientId);
    return client ? client.phone : 'No disponible';
  }

  getClientAddress(clientId: string): string {
    const client = this.clients.find(c => c.id === clientId);
    return client ? client.address : 'No disponible';
  }

  getServiceInfo(appointment: Appointment): any {
    this.getAppointmentDisplayDataUseCase.execute({
      appointment,
      services: this.services,
      clients: this.clients,
      technicians: this.technicians
    }).subscribe({
      next: (displayData) => {
        return displayData.serviceInfo;
      }
    });

    // Fallback for immediate return
    try {
      if (appointment.notes) {
        return JSON.parse(appointment.notes);
      }
    } catch (error) {
      console.error('Error parsing service info:', error);
    }
    return {};
  }

  getAppointmentStatus(appointment: Appointment): string {
    const appointmentDate = new Date(appointment.date);
    const [hours, minutes] = appointment.time.split(':').map(Number);

    // Create full date with hours and minutes
    const appointmentDateTime = new Date(appointmentDate);
    appointmentDateTime.setHours(hours, minutes, 0, 0);

    const currentDateTime = new Date();

    // If date and time have passed, it's completed
    if (appointmentDateTime < currentDateTime) {
      return 'Terminada';
    }
    return 'Pendiente';
  }

  getAppointmentStatusClass(appointment: Appointment): string {
    const status = this.getAppointmentStatus(appointment);
    return status === 'Pendiente' ? 'pending' : 'completed';
  }

  formatDate(date: Date): string {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'status-pending',
      'confirmed': 'status-confirmed',
      'in_progress': 'status-in-progress',
      'completed': 'status-completed',
      'cancelled': 'status-cancelled'
    };
    return statusMap[status] || 'status-pending';
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pendiente',
      'confirmed': 'Confirmada',
      'in_progress': 'En Progreso',
      'completed': 'Completada',
      'cancelled': 'Cancelada'
    };
    return statusMap[status] || status;
  }

  isAlreadyEvaluated(appointment: Appointment): boolean {
    return this.evaluatedAppointments.has(appointment.id);
  }

  openReviewModal(appointment: Appointment) {
    this.reviewAppointmentId = appointment.id;
    this.reviewTechnicianId = appointment.technicianId;
    this.reviewClientId = appointment.clientId;
    this.reviewClientName = this.getClientName(appointment.clientId);
    this.showReviewModal = true;
  }

  closeReviewModal() {
    this.showReviewModal = false;
    this.checkEvaluatedAppointments();
  }

  onReviewSubmitted(): void {
    this.checkEvaluatedAppointments();
    this.closeReviewModal();
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
