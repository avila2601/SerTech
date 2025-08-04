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
  selector: 'app-appointment-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointment-summary.component.html',
  styleUrls: ['./appointment-summary.component.scss']
})
export class AppointmentSummaryComponent implements OnInit {
  // Service and personal data
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

  // Technician information
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

      if (this.technicianId) {
        this.loadTechnicianData();
      }
    });
  }

  loadTechnicianData(): void {
    this.technicianService.getTechnicians().subscribe(technicians => {
      this.technician = technicians.find(tech => tech.id === this.technicianId) || null;
    });
  }

  confirmAppointment(): void {
    if (this.isScheduling) return;

    this.isScheduling = true;

    // Create or get client
    const clientData: Client = {
      id: '',
      name: this.name,
      email: this.email,
      phone: this.phone,
      address: this.address
    };

    this.clientService.addClient(clientData).pipe(
      switchMap(createdClient => {
        // Create appointment
        const appointmentData: Omit<Appointment, 'id' | 'status'> = {
          clientId: createdClient.id,
          technicianId: this.technicianId,
          serviceId: this.serviceId,
          equipmentId: undefined,
          date: new Date(this.date),
          time: this.time,
          notes: this.symptoms,
          address: this.location
        };

        return this.appointmentService.createAppointment(appointmentData);
      })
    ).subscribe({
      next: (createdAppointment) => {
        alert('¡Cita agendada exitosamente!');
        this.router.navigate(['/my-appointments']);
      },
      error: (error: any) => {
        console.error('Error scheduling appointment:', error);
        alert('Error al agendar la cita. Por favor, intenta de nuevo.');
        this.isScheduling = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/clients'], {
      queryParams: {
        marca: this.brand,
        producto: this.product,
        modelo: this.model,
        sintomas: this.symptoms,
        ubicacion: this.location,
        fecha: this.date,
        hora: this.time,
        tecnicoId: this.technicianId,
        servicioId: this.serviceId
      }
    });
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
