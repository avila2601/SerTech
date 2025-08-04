import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { ClientService } from '../../services/client.service';
import { TechnicianService } from '../../services/technician.service';
import { Client, Appointment, Technician } from '../../models';
import { switchMap } from 'rxjs/operators';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-resumen-cita',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resumen-cita.component.html',
  styleUrls: ['./resumen-cita.component.scss']
})
export class ResumenCitaComponent implements OnInit {
  // Datos del servicio y personales
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

  // Información del técnico
  technician: Technician | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appointmentService: AppointmentService,
    private clientService: ClientService,
    private technicianService: TechnicianService,
    private appComponent: AppComponent
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.brand = params['marca'] || '';
      this.product = params['producto'] || '';
      this.model = params['modelo'] || '';
      this.symptoms = params['sintomas'] || '';
      this.location = params['ubicacion'] || '';
      this.date = params['fecha'] || '';
      this.time = params['hora'] || '';
      this.name = params['nombre'] || '';
      this.email = params['email'] || '';
      this.phone = params['telefono'] || '';
      this.address = params['direccion'] || '';
      this.technicianId = params['tecnicoId'] || '';
      this.serviceId = params['servicioId'] || '';

      // Cargar información del técnico si hay tecnicoId
      if (this.technicianId) {
        this.loadTechnicianInfo();
      }
    });
  }

  loadTechnicianInfo(): void {
    this.technicianService.getTechnicianById(this.technicianId).subscribe((technician: Technician | undefined) => {
      this.technician = technician || null;
    });
  }

  goBack(): void {
    // Navegar de vuelta al componente información personal preservando todos los datos
    this.router.navigate(['/clientes'], {
      queryParams: {
        marca: this.brand,
        producto: this.product,
        modelo: this.model,
        sintomas: this.symptoms,
        ubicacion: this.location,
        fecha: this.date,
        hora: this.time,
        nombre: this.name,
        email: this.email,
        telefono: this.phone,
        direccion: this.address
      }
    });
  }

  scheduleAppointment(): void {
    if (!this.name || !this.email || !this.phone || !this.address) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    this.isScheduling = true;

    // Primero verificar si el cliente ya existe
    this.clientService.getClients().pipe(
      switchMap((clients: Client[]) => {
        const existingClient = clients.find(c => c.email === this.email);

        if (existingClient) {
          // Si el cliente existe, usar el existente
          return [existingClient];
        } else {
          // Si no existe, crear uno nuevo
          const client: Omit<Client, 'id'> = {
            name: this.name,
            email: this.email,
            phone: this.phone,
            address: this.address
          };
          return this.clientService.addClient(client);
        }
      }),
      switchMap((client: Client) => {
        // Guardar toda la información del servicio en las notas como JSON
        const serviceInfo = {
          marca: this.brand,
          producto: this.product,
          modelo: this.model,
          sintomas: this.symptoms,
          ubicacion: this.location
        };

        // Manejar fecha y hora opcionales
        let selectedDate: Date;
        if (this.date) {
          selectedDate = new Date(this.date + 'T00:00:00');
        } else {
          selectedDate = new Date();
        }

        const appointment: Omit<Appointment, 'id' | 'status'> = {
          clientId: client.id,
          technicianId: this.technicianId,
          serviceId: this.serviceId,
          date: selectedDate,
          time: this.time || 'Por coordinar',
          notes: JSON.stringify(serviceInfo),
          address: this.address
        };
        return this.appointmentService.createAppointment(appointment);
      })
    ).subscribe((newAppointment: Appointment) => {
      this.isScheduling = false;

      // Guardar IDs en localStorage
      localStorage.setItem('clienteLogueado', newAppointment.clientId);
      localStorage.setItem('citaEnProceso', newAppointment.id);

      // Actualizar el navbar inmediatamente
      this.appComponent.updateUserState();

      alert('¡Cita agendada exitosamente!');

      // Redirigir a mis-citas con el clienteId
      this.router.navigate(['/mis-citas'], { queryParams: { clienteId: newAppointment.clientId } });
    });
  }
}
