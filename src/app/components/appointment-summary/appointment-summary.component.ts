import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { ClientService } from '../../services/client.service';
import { TechnicianService } from '../../services/technician.service';
import { Client, Appointment, Technician } from '../../models';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserStateService } from '../../services/user-state.service';

@Component({
  selector: 'app-appointment-summary',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './appointment-summary.component.html',
  styleUrls: ['./appointment-summary.component.scss']
})
export class AppointmentSummaryComponent implements OnInit {
  // Service and personal details
  brand: string = '';
  product: string = '';
  model: string = '';
  symptoms: string = '';
  location: string = '';
  date: string = '';
  time: string = '';
  clientName: string = '';
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
    private userState: UserStateService
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
      this.clientName = params['clientName'] || '';
      this.email = params['email'] || '';
      this.phone = params['phone'] || '';
      this.address = params['address'] || '';
      this.technicianId = params['technicianId'] || '';
      this.serviceId = params['serviceId'] || '';

      // Load technician info if technicianId exists
      if (this.technicianId) {
        this.loadTechnicianInfo();
      }
    });
  }

  loadTechnicianInfo(): void {
    this.technicianService.getTechnicianById(this.technicianId).subscribe(techn => {
      this.technician = techn || null;
    });
  }

  goBack(): void {
    // Navigate back to client information preserving all data
    this.router.navigate(['/clients'], {
      queryParams: {
        brand: this.brand,
        product: this.product,
        model: this.model,
        symptoms: this.symptoms,
        location: this.location,
        date: this.date,
        time: this.time,
        clientName: this.clientName,
        email: this.email,
        phone: this.phone,
        address: this.address,
        technicianId: this.technicianId,
        serviceId: this.serviceId
      }
    });
  }

  scheduleAppointment(): void {
    if (!this.clientName || !this.email || !this.phone || !this.address) {
      alert('Please complete all required fields');
      return;
    }

    this.isScheduling = true;

    // Check if client exists or create new
    this.clientService.getClients().pipe(
      switchMap(clients => {
        const existingClient = clients.find(c => c.email === this.email);
        return existingClient
          ? of(existingClient)
          : this.clientService.addClient({ name: this.clientName, email: this.email, phone: this.phone, address: this.address });
      }),
      switchMap(client => {
        const serviceInfo = { brand: this.brand, product: this.product, model: this.model, symptoms: this.symptoms, location: this.location };
        const selectedDate = this.date ? new Date(this.date + 'T00:00:00') : new Date();
        const appointmentData: Omit<Appointment, 'id' | 'status'> = {
          clientId: client.id,
          technicianId: this.technicianId,
          serviceId: this.serviceId,
          date: selectedDate,
          time: this.time || 'To be scheduled',
          notes: JSON.stringify(serviceInfo),
          address: this.address
        };
        return this.appointmentService.createAppointment(appointmentData);
      })
    ).subscribe({
      next: newAppointment => {
        console.log('Appointment successfully created:', newAppointment);
        this.isScheduling = false;
        localStorage.setItem('clientLoggedIn', newAppointment.clientId);
        localStorage.setItem('appointmentInProgress', newAppointment.id);
        this.userState.updateUserStatus();
        alert('Appointment scheduled successfully!');
        this.router.navigate(['/my-appointments'], { queryParams: { clientId: newAppointment.clientId } });
      },
      error: err => {
        console.error('Error scheduling appointment:', err);
        this.isScheduling = false;
        alert('Error scheduling appointment. Please try again.');
      }
    });
  }
}
