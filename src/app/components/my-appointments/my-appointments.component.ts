import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
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
  styles: []
})
export class MyAppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  services: Service[] = [];
  technicians: Technician[] = [];
  clients: Client[] = [];
  clientIdCurrent: string | null = null; // By default, no filter
  technicianIdCurrent: string | null = null;
  showReviewModal = false;
  technicianIdReview = '';
  clientIdReview = '';
  clientNameReview = '';
  reviewedAppointments: Set<string> = new Set(); // Track reviewed appointments

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
    // Get the client or technician ID from query params or localStorage
    this.route.queryParams.subscribe(params => {
      if (params['clientId']) {
        this.clientIdCurrent = params['clientId'];
        this.technicianIdCurrent = null;
      } else if (params['technicianId']) {
        this.technicianIdCurrent = params['technicianId'];
        this.clientIdCurrent = null;
      } else {
        // If no query params, check localStorage
        const technicianLogged = localStorage.getItem('technicianLoggedIn');
        const clientLogged = localStorage.getItem('clientLoggedIn');
        const emailLogin = localStorage.getItem('emailLogin');

        if (technicianLogged) {
          this.technicianIdCurrent = technicianLogged;
          this.clientIdCurrent = null;
        } else if (clientLogged) {
          this.clientIdCurrent = clientLogged;
          this.technicianIdCurrent = null;
        } else if (emailLogin) {
          // Si hay un email guardado, filtrar por ese email
          this.clientService.getClients().subscribe(clients => {
            this.clientIdCurrent = clients.find(c => c.email === emailLogin)?.id || emailLogin;
            this.technicianIdCurrent = null;
            this.loadData();
          });
        } else {
          this.clientIdCurrent = null;
          this.technicianIdCurrent = null;
        }
      }
      this.loadData();
    });
  }

  loadData(): void {
    this.appointmentService.getAppointments().subscribe(appointments => {
      if (this.technicianIdCurrent) {
        this.appointments = appointments.filter(a => String(a.technicianId) === String(this.technicianIdCurrent));
      } else if (this.clientIdCurrent) {
        const emailLogin = localStorage.getItem('emailLogin');
        if (emailLogin) {
          this.appointments = appointments.filter(a => {
            const client = this.clients.find(cl => cl.id === a.clientId);
            return client?.email === emailLogin;
          });
        } else {
          this.appointments = appointments.filter(a => a.clientId === this.clientIdCurrent);
        }
      } else {
        this.appointments = []; // No mostrar citas si no hay filtro válido
      }
      this.filteredAppointments = this.appointments;
      this.verifyReviewedAppointments();
    });

    this.serviceService.getServices().subscribe(services => {
      this.services = services;
    });

    this.technicianService.getTechnicians().subscribe((technicians: Technician[]) => {
      this.technicians = technicians;
    });

    this.clientService.getClients().subscribe(clients => {
      this.clients = clients;
    });
  }

  verifyReviewedAppointments(): void {
    // Verificar qué citas ya han sido evaluadas
    this.filteredAppointments.forEach(appointment => {
      if (this.getAppointmentStatus(appointment) === 'Completed') {
        const technicianId = appointment.technicianId;
        const clientId = appointment.clientId;
        const clientName = this.getClientName(appointment.clientId);

        this.reviewService.reviewExists(technicianId, clientId, clientName).subscribe(exists => {
          if (exists) {
            this.reviewedAppointments.add(appointment.id);
          }
        });
      }
    });
  }

  formatDate(date: Date): string {
  // Ensure date is handled correctly
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getServiceName(serviceId: string): string {
    const service = this.services.find(s => s.id === serviceId);
    return service ? service.name : 'Service not found';
  }

  getTechnicianName(technicianId: string): string {
    const technician = this.technicians.find(t => t.id === technicianId);
    return technician ? technician.name : 'Unassigned';
  }

  getTechnicianSpecialty(technicianId: string): string {
    const technician = this.technicians.find(t => t.id === technicianId);
    return technician ? technician.specialty : 'Unavailable';
  }

  getTechnicianRating(technicianId: string): number {
    const technician = this.technicians.find(t => t.id === technicianId);
    return technician ? technician.rating : 0;
  }

  getClientName(clientId: string): string {
    const client = this.clients.find(c => c.id === clientId);
    return client ? client.name : 'Unavailable';
  }

  getClientEmail(clientId: string): string {
    const client = this.clients.find(c => c.id === clientId);
    return client ? client.email : 'Unavailable';
  }

  getClientPhone(clientId: string): string {
    const client = this.clients.find(c => c.id === clientId);
    return client ? client.phone : 'Unavailable';
  }

  getClientAddress(clientId: string): string {
    const client = this.clients.find(c => c.id === clientId);
    return client ? client.address : 'Unavailable';
  }

  getServiceInfo(appointment: Appointment): any {
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
    const apptDate = new Date(appointment.date);
    const currentDate = new Date();

    // If the appointment date has passed, mark as Completed
    if (apptDate < currentDate) {
      return 'Completed';
    }

    // If the date is in the future, mark as Pending
    return 'Pending';
  }

  getAppointmentStatusClass(appointment: Appointment): string {
    const status = this.getAppointmentStatus(appointment);
    return status === 'Pending' ? 'status-pending' : 'status-completed';
  }

  wasReviewed(appointment: Appointment): boolean {
    return this.reviewedAppointments.has(appointment.id);
  }

  // Open the review modal for a completed appointment
  openReviewModal(appointment: Appointment): void {
    this.technicianIdReview = appointment.technicianId;
    this.clientIdReview = appointment.clientId;
    this.clientNameReview = this.getClientName(appointment.clientId);
    this.showReviewModal = true;
  }

  // Close the review modal and refresh evaluated list
  closeReviewModal(): void {
    this.showReviewModal = false;
    this.verifyReviewedAppointments();
  }

  // Handle review submission event
  onReviewSubmitted(): void {
    const appointment = this.filteredAppointments.find(a =>
      a.technicianId === this.technicianIdReview && a.clientId === this.clientIdReview
    );
    if (appointment) {
      this.reviewedAppointments.add(appointment.id);
    }
  }
}
