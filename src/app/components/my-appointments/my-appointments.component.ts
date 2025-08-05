import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AppointmentService } from '../../services/appointment.service';
import { ServiceService } from '../../services/service.service';
import { TechnicianService } from '../../services/technician.service';
import { ClientService } from '../../services/client.service';
import { ReviewService } from '../../services/review.service';
<<<<<<< HEAD
import { Appointment, Service, Technician, Client, AppointmentStatus } from '../../models';
=======
import { Appointment, Service, Technician, Client } from '../../models';
>>>>>>> 9c96325ffa0600b4d82747c8d2cb2bc933498b08
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
<<<<<<< HEAD
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
=======
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
>>>>>>> 9c96325ffa0600b4d82747c8d2cb2bc933498b08
          this.currentClientId = null;
          this.currentTechnicianId = null;
        }
      }
      this.loadData();
    });
  }

  loadData(): void {
<<<<<<< HEAD
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
=======
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
>>>>>>> 9c96325ffa0600b4d82747c8d2cb2bc933498b08
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
<<<<<<< HEAD
=======
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
>>>>>>> 9c96325ffa0600b4d82747c8d2cb2bc933498b08
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

<<<<<<< HEAD
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
=======
  getClientEmail(clientId: string): string {
    const client = this.clients.find(c => c.id === clientId);
    return client ? client.email : 'No disponible';
>>>>>>> 9c96325ffa0600b4d82747c8d2cb2bc933498b08
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

<<<<<<< HEAD
  onReviewSubmitted(): void {
    // Recargar los datos para actualizar las evaluaciones
    this.checkEvaluatedAppointments();
    this.closeReviewModal();
  }
=======
  onReviewSubmitted() {
    // Marcar la cita actual como evaluada
    const currentAppointment = this.filteredAppointments.find(appointment =>
      appointment.technicianId === this.reviewTechnicianId &&
      appointment.clientId === this.reviewClientId
    );
>>>>>>> 9c96325ffa0600b4d82747c8d2cb2bc933498b08

    if (currentAppointment) {
      this.evaluatedAppointments.add(currentAppointment.id);
    }
  }
}
