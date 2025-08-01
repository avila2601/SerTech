import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { ServiceService } from '../../services/service.service';
import { TechnicianService } from '../../services/technician.service';
import { ClientService } from '../../services/client.service';
import { forkJoin } from 'rxjs';
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
      console.log('Query params:', params);

      if (params['clientId']) {
        this.clientIdCurrent = params['clientId'];
        this.technicianIdCurrent = null;
        console.log('Using clientId from params:', this.clientIdCurrent);
      } else if (params['technicianId']) {
        this.technicianIdCurrent = params['technicianId'];
        this.clientIdCurrent = null;
        console.log('Using technicianId from params:', this.technicianIdCurrent);
      } else {
        // If no query params, check localStorage
        const technicianLogged = localStorage.getItem('tecnicoLogueado');
        const clientLogged = localStorage.getItem('clienteLogueado');
        const emailLogin = localStorage.getItem('emailLogin');

        console.log('LocalStorage values:', { technicianLogged, clientLogged, emailLogin });

        if (technicianLogged) {
          this.technicianIdCurrent = technicianLogged;
          this.clientIdCurrent = null;
          console.log('Using technicianId from localStorage:', this.technicianIdCurrent);
        } else if (clientLogged) {
          this.clientIdCurrent = clientLogged;
          this.technicianIdCurrent = null;
          console.log('Using clientId from localStorage:', this.clientIdCurrent);
        } else if (emailLogin) {
          // Si hay un email guardado, filtrar por ese email
          this.clientService.getClients().subscribe(clients => {
            this.clientIdCurrent = clients.find(c => c.email === emailLogin)?.id || emailLogin;
            this.technicianIdCurrent = null;
            console.log('Using clientId from email lookup:', this.clientIdCurrent);
            this.loadData();
          });
          return; // Exit early since loadData is called in the subscription
        } else {
          this.clientIdCurrent = null;
          this.technicianIdCurrent = null;
          console.log('No user identification found');
        }
      }
      console.log('About to call loadData() with clientIdCurrent:', this.clientIdCurrent, 'technicianIdCurrent:', this.technicianIdCurrent);
      this.loadData();
    });
  }

  loadData(): void {
    console.log('loadData() method called');

    // Load all needed data in parallel to ensure services are available for getServiceName
    console.log('Creating forkJoin...');

    // Add a small delay to ensure all services are ready
    setTimeout(() => {
      forkJoin({
        appts: this.appointmentService.getAppointments(),
        svcs: this.serviceService.getServices(),
        techs: this.technicianService.getTechnicians(),
        clients: this.clientService.getClients()
      }).subscribe({
      next: ({ appts, svcs, techs, clients }) => {
        console.log('=== LOAD DATA DEBUG ===');
        console.log('Raw appointments from service:', appts);
        console.log('Services loaded:', svcs.length);
        console.log('Technicians loaded:', techs.length);
        console.log('Clients loaded:', clients.length);
        console.log('Current clientIdCurrent:', this.clientIdCurrent);
        console.log('Current technicianIdCurrent:', this.technicianIdCurrent);

      this.services = svcs;
      this.technicians = techs;
      this.clients = clients;
      // Filter appointments based on current user
      let filtered = appts;
      console.log('Before filtering - Total appointments:', appts.length);

      if (this.technicianIdCurrent) {
        console.log('Filtering by technicianId:', this.technicianIdCurrent);
        filtered = appts.filter(a => String(a.technicianId) === String(this.technicianIdCurrent));
        console.log('Filtered by technician - Results:', filtered.length);
      } else if (this.clientIdCurrent) {
        console.log('Filtering by clientId:', this.clientIdCurrent);
        const emailLogin = localStorage.getItem('emailLogin');
        if (emailLogin) {
          console.log('Filtering by email:', emailLogin);
          // Si hay email en localStorage, filtrar por email del cliente
          filtered = appts.filter(a => {
            const client = clients.find(cl => cl.id === a.clientId);
            const matches = client?.email === emailLogin;
            console.log(`Appointment ${a.id}: clientId=${a.clientId}, client found:`, client, 'email matches:', matches);
            return matches;
          });
        } else {
          console.log('Filtering directly by clientId');
          // Filtrar directamente por clientId
          filtered = appts.filter(a => {
            const matches = String(a.clientId) === String(this.clientIdCurrent);
            console.log(`Appointment ${a.id}: clientId="${a.clientId}" === "${this.clientIdCurrent}" = ${matches}`);
            return matches;
          });
        }
        console.log('Filtered by client - Results:', filtered.length);
      } else {
        console.log('No user filter applied - showing empty list');
        filtered = [];
      }

      console.log('=== FINAL RESULTS ===');
      console.log('Filtered appointments:', filtered);
      console.log('Setting component appointments to:', filtered.length, 'items');

      this.appointments = filtered;
      this.filteredAppointments = filtered;
      this.verifyReviewedAppointments();
    },
    error: (error) => {
      console.error('=== ERROR IN LOAD DATA ===');
      console.error('Error loading data:', error);
    }
    });
    }, 100); // Small delay to ensure all services are ready
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
