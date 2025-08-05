import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AppointmentService } from '../../services/appointment.service';
import { ServiceService } from '../../services/service.service';
import { TechnicianService } from '../../services/technician.service';
import { ClientService } from '../../services/client.service';
import { ReviewService } from '../../services/review.service';
import { Appointment, Service, Technician, Client, AppointmentStatus } from '../../models';
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
        const emailLogin = localStorage.getItem('emailLogin');

        if (loggedClientId) {
          this.currentClientId = loggedClientId;
          this.currentTechnicianId = null;
        } else if (loggedTechnicianId) {
          this.currentTechnicianId = loggedTechnicianId;
          this.currentClientId = null;
        } else if (emailLogin) {
          // Use email to find client after data loads
          this.currentClientId = null;
          this.currentTechnicianId = null;
        }
      }

      this.loadData();
    });
  }

  loadData(): void {
    // Cargar todos los datos al mismo tiempo usando forkJoin
    forkJoin({
      appointments: this.appointmentService.getAppointments(),
      services: this.serviceService.getServices(),
      technicians: this.technicianService.getTechnicians(),
      clients: this.clientService.getClients()
    }).subscribe({
      next: (data) => {
        console.log('Datos cargados en my-appointments:', {
          appointments: data.appointments?.length || 0,
          clients: data.clients?.length || 0,
          services: data.services?.length || 0,
          technicians: data.technicians?.length || 0
        });

        // Asignar todos los datos
        this.appointments = data.appointments || [];
        this.services = data.services || [];
        this.technicians = data.technicians || [];
        this.clients = data.clients || [];

        console.log('Estado actual del componente:', {
          currentClientId: this.currentClientId,
          currentTechnicianId: this.currentTechnicianId,
          emailLogin: localStorage.getItem('emailLogin')
        });

        // Filtrar las citas después de tener todos los datos
        this.filterAppointments();
        console.log('Citas filtradas:', this.filteredAppointments.length);
        this.checkEvaluatedAppointments();
      },
      error: (error) => {
        console.error('Error loading data:', error);
        // Inicializar arrays vacíos en caso de error
        this.appointments = [];
        this.services = [];
        this.technicians = [];
        this.clients = [];
        this.filteredAppointments = [];
      }
    });
  }

  filterAppointments(): void {
    console.log('=== INICIO DE FILTRADO ===');
    console.log('Total de citas antes del filtrado:', this.appointments.length);
    console.log('Todas las citas:', this.appointments);
    console.log('Filtros disponibles:', {
      currentClientId: this.currentClientId,
      currentTechnicianId: this.currentTechnicianId,
      emailLogin: localStorage.getItem('emailLogin')
    });

    if (this.currentClientId) {
      console.log('Filtrando por currentClientId:', this.currentClientId);
      this.filteredAppointments = this.appointments.filter(
        appointment => {
          const match = appointment.clientId === this.currentClientId;
          console.log(`Cita ${appointment.id}: clientId=${appointment.clientId}, match=${match}`);
          return match;
        }
      );
    } else if (this.currentTechnicianId) {
      console.log('Filtrando por currentTechnicianId:', this.currentTechnicianId);
      this.filteredAppointments = this.appointments.filter(
        appointment => appointment.technicianId === this.currentTechnicianId
      );
    } else {
      // Check if we should filter by email
      const emailLogin = localStorage.getItem('emailLogin');
      console.log('No hay clientId/technicianId, verificando emailLogin:', emailLogin);

      if (emailLogin) {
        console.log('Filtrando por email:', emailLogin);
        console.log('Clientes disponibles:', this.clients);

        this.filteredAppointments = this.appointments.filter(appointment => {
          const client = this.clients.find(cl => cl.id === appointment.clientId);
          const match = client?.email === emailLogin;
          console.log(`Cita ${appointment.id}: clientId=${appointment.clientId}, cliente encontrado:`, client, `email match: ${match}`);
          return match;
        });
      } else {
        console.log('Sin filtros, mostrando todas las citas');
        this.filteredAppointments = [...this.appointments];
      }
    }

    console.log('=== RESULTADO DEL FILTRADO ===');
    console.log('Citas filtradas:', this.filteredAppointments.length);
    console.log('Citas filtradas detalle:', this.filteredAppointments);
  }

  checkEvaluatedAppointments(): void {
    // Verificar qué citas ya han sido evaluadas
    this.filteredAppointments.forEach(appointment => {
      if (appointment.status === AppointmentStatus.COMPLETED) {
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

  // Métodos adicionales para información detallada del cliente
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

  // Métodos adicionales para información detallada del técnico
  getTechnicianSpecialty(technicianId: string): string {
    const technician = this.technicians.find(t => t.id === technicianId);
    return technician ? technician.specialty : 'No disponible';
  }

  getTechnicianRating(technicianId: string): number {
    const technician = this.technicians.find(t => t.id === technicianId);
    return technician ? technician.rating : 0;
  }

  // Método para obtener información del servicio desde las notas de la cita
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

  // Método para formatear fecha
  formatDate(date: Date): string {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  onReviewSubmitted(): void {
    // Recargar los datos para actualizar las evaluaciones
    this.checkEvaluatedAppointments();
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
