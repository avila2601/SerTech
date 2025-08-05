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
  styleUrls: ['./my-appointments.component.scss']
})
export class MyAppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  services: Service[] = [];
  technicians: Technician[] = [];
  clients: Client[] = [];
  currentClientId: string | null = null; // Por defecto, sin filtro
  currentTechnicianId: string | null = null;
  showReviewModal = false;
  reviewTechnicianId = '';
  reviewClientId = '';
  reviewClientName = '';
  evaluatedAppointments: Set<string> = new Set(); // Para trackear citas ya evaluadas

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
    // Obtener el ID del cliente o del técnico desde query params o localStorage
    this.route.queryParams.subscribe(params => {
      if (params['clientId']) {
        this.currentClientId = params['clientId'];
        this.currentTechnicianId = null;
      } else if (params['technicianId']) {
        this.currentTechnicianId = params['technicianId'];
        this.currentClientId = null;
      } else {
        // Si no hay query params, verificar localStorage
        const loggedTechnician = localStorage.getItem('loggedTechnician');
        const loggedClient = localStorage.getItem('loggedClient');
        const emailLogin = localStorage.getItem('emailLogin');

        if (loggedTechnician) {
          this.currentTechnicianId = loggedTechnician;
          this.currentClientId = null;
        } else if (loggedClient) {
          this.currentClientId = loggedClient;
          this.currentTechnicianId = null;
        } else if (emailLogin) {
          // Si hay un email guardado, filtrar por ese email
          this.clientService.getClients().subscribe(clients => {
            const clientWithEmail = clients.find(c => c.email === emailLogin);
            this.currentClientId = clientWithEmail ? clientWithEmail.id : emailLogin;
            this.currentTechnicianId = null;
            this.loadData();
          });
        } else {
          this.currentClientId = null;
          this.currentTechnicianId = null;
        }
      }
      this.loadData();
    });
  }

  loadData(): void {
    this.appointmentService.getAppointments().subscribe(appointments => {
      if (this.currentTechnicianId) {
        this.appointments = appointments.filter(a => String(a.technicianId) === String(this.currentTechnicianId));
      } else if (this.currentClientId) {
        const emailLogin = localStorage.getItem('emailLogin');
        if (emailLogin) {
          // Si hay emailLogin, mostrar solo las citas donde el email coincide
          this.appointments = appointments.filter(a => {
            const client = this.clients.find(cl => cl.id === a.clientId);
            return client?.email === emailLogin;
          });
        } else {
          // Si hay clienteId, mostrar solo las citas de ese cliente
          this.appointments = appointments.filter(a => a.clientId === this.currentClientId);
        }
      } else {
        this.appointments = []; // No mostrar citas si no hay filtro válido
      }
      this.filteredAppointments = this.appointments;
      this.checkEvaluatedAppointments();
    });

    this.serviceService.getServices().subscribe(services => {
      this.services = services;
    });

    this.technicianService.getTechnicians().subscribe(technicians => {
      this.technicians = technicians;
    });

    this.clientService.getClients().subscribe(clients => {
      this.clients = clients;
    });
  }

  checkEvaluatedAppointments(): void {
    // Verificar qué citas ya han sido evaluadas
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
    // Asegurar que la fecha se maneje correctamente
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
        return JSON.parse(appointment.notes);
      }
    } catch (error) {
      console.error('Error parsing service info:', error);
    }
    return {};
  }

  getAppointmentStatus(appointment: Appointment): string {
    const appointmentDate = new Date(appointment.date);
    const currentDate = new Date();

    // Si la fecha de la cita ya pasó, mostrar "Terminada"
    if (appointmentDate < currentDate) {
      return 'Terminada';
    }

    // Si la fecha es futura, mostrar "Pendiente"
    return 'Pendiente';
  }

  getAppointmentStatusClass(appointment: Appointment): string {
    const status = this.getAppointmentStatus(appointment);
    return status === 'Pendiente' ? 'status-pending' : 'status-completed';
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
    // Recargar las citas evaluadas después de cerrar el modal
    this.checkEvaluatedAppointments();
  }

  onReviewSubmitted() {
    // Marcar la cita actual como evaluada
    const currentAppointment = this.filteredAppointments.find(appointment =>
      appointment.technicianId === this.reviewTechnicianId &&
      appointment.clientId === this.reviewClientId
    );

    if (currentAppointment) {
      this.evaluatedAppointments.add(currentAppointment.id);
    }
  }
}
