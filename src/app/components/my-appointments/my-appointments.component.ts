import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { ServiceService } from '../../services/service.service';
import { TechnicianService } from '../../services/technician.service';
import { ClientService } from '../../services/client.service';
import { ReviewService } from '../../services/review.service';
import { Appointment, Service, Technician, Client, AppointmentStatus } from '../../models';

@Component({
  selector: 'app-my-appointments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-appointments.component.html',
  styleUrls: ['./my-appointments.component.scss']
})
export class MyAppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  services: Service[] = [];
  technicians: Technician[] = [];
  clients: Client[] = [];
  currentClientId: string | null = null; // By default, no filter
  currentTechnicianId: string | null = null;
  showReviewModal = false;
  reviewTechnicianId = '';
  reviewClientId = '';
  reviewClientName = '';
  evaluatedAppointments: Set<string> = new Set(); // To track already evaluated appointments

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
    // Get client or technician ID from query params or localStorage
    this.route.queryParams.subscribe(params => {
      if (params['clientId']) {
        this.currentClientId = params['clientId'];
        this.currentTechnicianId = null;
      } else if (params['technicianId']) {
        this.currentTechnicianId = params['technicianId'];
        this.currentClientId = null;
      } else {
        // Check localStorage for logged client or technician
        const loggedClientId = localStorage.getItem('loggedClient');
        const loggedTechnicianId = localStorage.getItem('loggedTechnician');

        if (loggedClientId) {
          this.currentClientId = loggedClientId;
        } else if (loggedTechnicianId) {
          this.currentTechnicianId = loggedTechnicianId;
        }
      }

      this.loadData();
    });
  }

  loadData(): void {
    // Load appointments
    this.appointmentService.getAppointments().subscribe(appointments => {
      this.appointments = appointments;
      this.filterAppointments();
    });

    // Load services
    this.serviceService.getServices().subscribe(services => {
      this.services = services;
    });

    // Load technicians
    this.technicianService.getTechnicians().subscribe(technicians => {
      this.technicians = technicians;
    });

    // Load clients
    this.clientService.getClients().subscribe(clients => {
      this.clients = clients;
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
      this.filteredAppointments = [...this.appointments];
    }
  }

  getServiceName(serviceId: string): string {
    const service = this.services.find(s => s.id === serviceId);
    return service ? service.name : 'Servicio no encontrado';
  }

  getTechnicianName(technicianId: string): string {
    const technician = this.technicians.find(t => t.id === technicianId);
    return technician ? technician.name : 'Técnico no encontrado';
  }

  getClientName(clientId: string): string {
    const client = this.clients.find(c => c.id === clientId);
    return client ? client.name : 'Cliente no encontrado';
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

  getStatusClass(status: string): string {
    const classMap: { [key: string]: string } = {
      'pending': 'estado-pendiente',
      'confirmed': 'estado-confirmada',
      'in_progress': 'estado-en-progreso',
      'completed': 'estado-completada',
      'cancelled': 'estado-cancelada'
    };
    return classMap[status] || '';
  }

  canEvaluate(appointment: Appointment): boolean {
    return appointment.status === AppointmentStatus.COMPLETED &&
           !this.evaluatedAppointments.has(appointment.id) &&
           this.currentClientId !== null; // Only clients can evaluate
  }

  evaluateTechnician(appointment: Appointment): void {
    if (this.canEvaluate(appointment)) {
      this.reviewTechnicianId = appointment.technicianId;
      this.reviewClientId = appointment.clientId;
      this.reviewClientName = this.getClientName(appointment.clientId);
      this.showReviewModal = true;
    }
  }

  closeReviewModal(): void {
    this.showReviewModal = false;
    this.reviewTechnicianId = '';
    this.reviewClientId = '';
    this.reviewClientName = '';
  }

  onReviewSubmitted(appointmentId: string): void {
    this.evaluatedAppointments.add(appointmentId);
    this.closeReviewModal();
  }

  cancelAppointment(appointmentId: string): void {
    if (confirm('¿Estás seguro de que quieres cancelar esta cita?')) {
      this.appointmentService.cancelAppointment(appointmentId);
      this.loadData(); // Reload data
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
