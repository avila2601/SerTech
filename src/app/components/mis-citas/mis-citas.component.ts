import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { ServiceService } from '../../services/service.service';
import { TechnicianService } from '../../services/technician.service';
import { ClientService } from '../../services/client.service';
import { ResenaService } from '../../services/resena.service';
import { Appointment, Service, Technician, Client } from '../../models';
import { ResenasComponent } from '../resenas/resenas.component';

@Component({
  selector: 'app-mis-citas',
  standalone: true,
  imports: [CommonModule, ResenasComponent],
  templateUrl: './mis-citas.component.html',
  styleUrls: ['./mis-citas.component.scss']
})
export class MisCitasComponent implements OnInit {
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
    private resenaService: ResenaService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Obtener el ID del cliente o del técnico desde query params o localStorage
    this.route.queryParams.subscribe(params => {
      if (params['clienteId']) {
        this.currentClientId = params['clienteId'];
        this.currentTechnicianId = null;
      } else if (params['tecnicoId']) {
        this.currentTechnicianId = params['tecnicoId'];
        this.currentClientId = null;
      } else {
        // Si no hay query params, verificar localStorage
        const tecnicoLogueado = localStorage.getItem('tecnicoLogueado');
        const clienteLogueado = localStorage.getItem('clienteLogueado');
        const emailLogin = localStorage.getItem('emailLogin');

        if (tecnicoLogueado) {
          this.currentTechnicianId = tecnicoLogueado;
          this.currentClientId = null;
        } else if (clienteLogueado) {
          this.currentClientId = clienteLogueado;
          this.currentTechnicianId = null;
        } else if (emailLogin) {
          // Si hay un email guardado, filtrar por ese email
          this.clientService.getClients().subscribe((clients: Client[]) => {
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
    this.appointmentService.getAppointments().subscribe((appointments: Appointment[]) => {
      if (this.currentTechnicianId) {
        this.appointments = appointments.filter(c => String(c.technicianId) === String(this.currentTechnicianId));
      } else if (this.currentClientId) {
        const emailLogin = localStorage.getItem('emailLogin');
        if (emailLogin) {
          // Si hay emailLogin, mostrar solo las citas donde el email coincide
          this.appointments = appointments.filter(c => {
            const client = this.clients.find(cl => cl.id === c.clientId);
            return client?.email === emailLogin;
          });
        } else {
          // Si hay clienteId, mostrar solo las citas de ese cliente
          this.appointments = appointments.filter(c => c.clientId === this.currentClientId);
        }
      } else {
        this.appointments = []; // No mostrar citas si no hay filtro válido
      }
      this.filteredAppointments = this.appointments;
      this.checkEvaluatedAppointments();
    });

    this.serviceService.getServices().subscribe((services: Service[]) => {
      this.services = services;
    });

    this.technicianService.getTechnicians().subscribe((technicians: Technician[]) => {
      this.technicians = technicians;
    });

    this.clientService.getClients().subscribe((clients: Client[]) => {
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

        this.resenaService.existeResena(technicianId, clientId, clientName).subscribe(exists => {
          if (exists) {
            this.evaluatedAppointments.add(appointment.id);
          }
        });
      }
    });
  }

  formatDate(fecha: Date): string {
    // Asegurar que la fecha se maneje correctamente
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', {
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
    return status === 'Pendiente' ? 'estado-pendiente' : 'estado-terminada';
  }

  wasAlreadyEvaluated(appointment: Appointment): boolean {
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

  onReviewSent() {
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
