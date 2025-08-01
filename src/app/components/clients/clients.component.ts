import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  informacionForm: FormGroup;
  isSubmitting = false;

  // Selected service info
  brand: string = '';
  product: string = '';
  model: string = '';
  symptoms: string = '';
  location: string = '';
  // IDs para flujo
  technicianId: string = '';
  serviceId: string = '';

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.informacionForm = this.fb.group({
      clientName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      date: [''],
      time: ['']
    });
  }

  ngOnInit(): void {
    // Obtener los datos del servicio seleccionado y personales desde query params
    this.route.queryParams.subscribe(params => {
      // Recoger detalles del servicio (inglés o español)
      this.brand        = params['brand']     || params['marca']     || '';
      this.product      = params['product']   || params['producto']  || '';
      this.model        = params['model']     || params['modelo']    || '';
      this.symptoms     = params['symptoms']  || params['sintomas']  || '';
      this.location     = params['location']  || params['ubicacion'] || '';
      // IDs para flow
      this.technicianId = params['technicianId'] || params['tecnicoId'] || '';
      this.serviceId    = params['serviceId']    || params['servicioId']|| '';

      // Rellenar el formulario si existen datos personales y de fecha/hora
      this.informacionForm.patchValue({
        clientName: params['clientName'] || '',
        email: params['email'] || '',
        phone: params['phone'] || '',
        address: params['address'] || '',
        date: params['date'] || '',
        time: params['time'] || ''
      });
    });

    // --- NUEVO: Cargar datos del cliente logueado si existe ---
    const clientId = localStorage.getItem('clientLoggedIn');
    if (clientId) {
      this.clientService.getClients().subscribe((clients: Client[]) => {
        const client = clients.find(c => c.id === clientId);
        if (client) {
          this.informacionForm.patchValue({
            clientName: client.name,
            email: client.email,
            phone: client.phone,
            address: client.address
          });
        }
      });
    } else {
      // Si no hay cliente logueado pero hay un email en localStorage, prellenar solo el email
      const emailLogin = localStorage.getItem('emailLogin');
      if (emailLogin) {
        this.informacionForm.patchValue({
          email: emailLogin
        });
      }
    }
  }

  onSubmit(): void {
    if (this.informacionForm.valid) {
      this.isSubmitting = true;

      const formValue = this.informacionForm.value;
      const params = this.route.snapshot.queryParams;
      const clientId = localStorage.getItem('clientLoggedIn');
      const appointmentId = localStorage.getItem('appointmentInProgress');
      const emailLogin = localStorage.getItem('emailLogin');

      const navigateToSummary = (newClientId?: string) => {
        // Si hay una cita en proceso, actualizar su clienteId
        if (appointmentId && newClientId) {
          this.appointmentService.updateClientInAppointment(appointmentId, newClientId);
          localStorage.removeItem('appointmentInProgress');
        }

        this.router.navigate(['/appointment-summary'], {
          queryParams: {
            brand: this.brand,
            product: this.product,
            model: this.model,
            symptoms: this.symptoms,
            location: this.location,
            date: formValue.date,
            time: formValue.time,
            clientName: formValue.clientName,
            email: formValue.email,
            phone: formValue.phone,
            address: formValue.address,
            technicianId: this.technicianId,
            serviceId: this.serviceId
          }
        });
      };

      if (clientId) {
        // Update client data in backend
        this.clientService.updateClient(clientId, {
          name: formValue.clientName,
          email: formValue.email,
          phone: formValue.phone,
          address: formValue.address
        }).subscribe({
          next: () => navigateToSummary(),
          error: () => navigateToSummary() // If error, still navigate
        });
      } else {
        // No logged-in client: just navigate to summary
        // Client creation happens on final confirmation
        navigateToSummary();
      }
    }
  }

  goBack(): void {
    // Navigate back to technicians page with service and client data
    this.router.navigate(['/technicians'], {
      queryParams: {
        serviceId: this.route.snapshot.queryParams['serviceId'] || '',
        brand: this.brand,
        product: this.product,
        model: this.model,
        symptoms: this.symptoms,
        location: this.location,
        date: this.informacionForm.get('date')?.value || '',
        time: this.informacionForm.get('time')?.value || ''
      }
    });
  }
}
