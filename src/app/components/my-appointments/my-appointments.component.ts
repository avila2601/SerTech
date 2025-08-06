import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AppointmentService } from '../../services/appointment.service';
import { ServiceService } from '../../services/service.service';
import { TechnicianService } from '../../services/technician.service';
import { ClientService } from '../../services/client.service';
import { ReviewService } from '../../services/review.service';
import { Appointment, Service, Technician, Client } from '../../models';
import { ReviewsComponent } from '../reviews/reviews.component';

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
  evaluatedAppointments: Set<string> = new Set();

  constructor(
    private appointmentService: AppointmentService,
    private serviceService: ServiceService,
    private technicianService: TechnicianService,
    private clientService: ClientService,
    private reviewService: ReviewService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

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
      this.loadData();
    });
  }

  loadData(): void {
    forkJoin({
      appointments: this.appointmentService.getAppointments(),
      services: this.serviceService.getServices(),
      technicians: this.technicianService.getTechnicians(),
      clients: this.clientService.getClients()
    }).subscribe({
      next: (data) => {
        this.appointments = data.appointments || [];
        this.services = data.services || [];
        this.technicians = data.technicians || [];
        this.clients = data.clients || [];
        this.filterAppointments();
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

  filterAppointments(): void {
    if (this.currentClientId) {
      this.filteredAppointments = this.appointments.filter(
        appointment => appointment.clientId === this.currentClientId
      );
    } else if (this.currentTechnicianId) {
      this.filteredAppointments = this.appointments.filter(
        appointment => appointment.technicianId === this.currentTechnicianId
      );
    } else {
      const emailLogin = localStorage.getItem('emailLogin');
      if (emailLogin) {
        this.filteredAppointments = this.appointments.filter(appointment => {
          const client = this.clients.find(cl => cl.id === appointment.clientId);
          return client?.email === emailLogin;
        });
      } else {
        this.filteredAppointments = [...this.appointments];
      }
    }
  }

  checkEvaluatedAppointments(): void {
    this.filteredAppointments.forEach(appointment => {
      if (this.getAppointmentStatus(appointment) === 'Terminada') {
        const technicianId = appointment.technicianId;
        const clientId = appointment.clientId;
        const clientName = this.getClientName(appointment.clientId);

        this.reviewService.reviewExists(technicianId, clientId, clientName).subscribe(exists => {
          if (exists) {
            this.evaluatedAppointments.add(appointment.id);
          }
        });
      }
    });
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
    try {
      if (appointment.notes) {
        const parsed = JSON.parse(appointment.notes);
        return parsed;
      }
    } catch (error) {
      console.error('Error parsing service info:', error);
    }
    return {};
  }

  getAppointmentStatus(appointment: Appointment): string {
    const appointmentDate = new Date(appointment.date);
    const [hours, minutes] = appointment.time.split(':').map(Number);
    
    // Crear fecha completa con hora y minutos
    const appointmentDateTime = new Date(appointmentDate);
    appointmentDateTime.setHours(hours, minutes, 0, 0);
    
    const currentDateTime = new Date();
    
    // Si la fecha y hora ya pasaron, está terminada
    if (appointmentDateTime < currentDateTime) {
      return 'Terminada';
    }
    return 'Pendiente';
  }

  getAppointmentStatusClass(appointment: Appointment): string {
    const status = this.getAppointmentStatus(appointment);
    return status === 'Pendiente' ? 'pending' : 'completed';
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
