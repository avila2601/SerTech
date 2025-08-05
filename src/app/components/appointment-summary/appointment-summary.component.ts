import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { ClientService } from '../../services/client.service';
import { TechnicianService } from '../../services/technician.service';
import { Client, Appointment, Technician } from '../../models';
import { switchMap } from 'rxjs/operators';

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
    private technicianService: TechnicianService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.brand = params['brand'] || '';
      this.product = params['product'] || '';
      this.model = params['model'] || '';
      this.symptoms = params['symptoms'] || '';
      this.location = params['location'] || '';
      this.date = params['date'] || '';
      this.time = params['time'] || '';
      this.name = params['name'] || '';
      this.email = params['email'] || '';
      this.phone = params['phone'] || '';
      this.address = params['address'] || '';
      this.technicianId = params['technicianId'] || '';
      this.serviceId = params['serviceId'] || '';

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

    // Check if client is already logged in
    const loggedClientId = localStorage.getItem('loggedClient');

    if (loggedClientId) {
      // Use existing logged client and save email for filtering
      localStorage.setItem('emailLogin', this.email);
      this.createAppointmentWithClient(loggedClientId).subscribe({
        next: (createdAppointment) => {
          this.handleAppointmentSuccess();
        },
        error: (error: any) => {
          this.handleAppointmentError(error);
        }
      });
    } else {
      // Create new client
      const clientData: Client = {
        id: '',
        name: this.name,
        email: this.email,
        phone: this.phone,
        address: this.address
      };

      this.clientService.addClient(clientData).pipe(
        switchMap(createdClient => {
          console.log('Cliente creado:', createdClient);
          // Store client as logged in and save email for filtering
          localStorage.setItem('loggedClient', createdClient.id);
          localStorage.setItem('emailLogin', createdClient.email);
          console.log('Cliente guardado en localStorage:', createdClient.id, createdClient.email);
          return this.createAppointmentWithClient(createdClient.id);
        })
      ).subscribe({
        next: (createdAppointment) => {
          this.handleAppointmentSuccess();
        },
        error: (error: any) => {
          this.handleAppointmentError(error);
        }
      });
    }
  }

  private createAppointmentWithClient(clientId: string) {
    // Create appointment
    const appointmentData: Omit<Appointment, 'id' | 'status'> = {
      clientId: clientId,
      technicianId: this.technicianId,
      serviceId: this.serviceId,
      equipmentId: undefined,
      date: new Date(this.date),
      time: this.time,
      notes: this.symptoms,
      address: this.location
    };

    return this.appointmentService.createAppointment(appointmentData);
  }

  private handleAppointmentSuccess() {
    alert('¡Cita agendada exitosamente!');

    // Get the logged client ID
    const loggedClientId = localStorage.getItem('loggedClient');

    // Trigger storage event to update navbar
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'loggedClient',
      newValue: loggedClientId
    }));

    // Navigate to my-appointments with client parameter
    if (loggedClientId) {
      this.router.navigate(['/my-appointments'], {
        queryParams: { clientId: loggedClientId }
      });
    } else {
      this.router.navigate(['/my-appointments']);
    }
  }

  private handleAppointmentError(error: any) {
    console.error('Error scheduling appointment:', error);
    alert('Error al agendar la cita. Por favor, intenta de nuevo.');
    this.isScheduling = false;
  }  goBack(): void {
    this.router.navigate(['/clients'], {
      queryParams: {
        brand: this.brand,
        product: this.product,
        model: this.model,
        symptoms: this.symptoms,
        location: this.location,
        date: this.date,
        time: this.time,
        technicianId: this.technicianId,
        serviceId: this.serviceId
      }
    });
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
