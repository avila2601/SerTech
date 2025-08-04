import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  informationForm: FormGroup;
  isSubmitting = false;

  // Selected service information
  selectedBrand: string = '';
  selectedProduct: string = '';
  selectedModel: string = '';
  selectedSymptoms: string = '';
  selectedLocation: string = '';

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.informationForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      date: [''],
      time: ['']
    });
  }

  ngOnInit(): void {
    // Get selected service and personal data from query params
    this.route.queryParams.subscribe(params => {
      this.selectedBrand = params['brand'] || '';
      this.selectedProduct = params['product'] || '';
      this.selectedModel = params['model'] || '';
      this.selectedSymptoms = params['symptoms'] || '';
      this.selectedLocation = params['location'] || '';

      // Fill the form if personal and date/time data exists
      this.informationForm.patchValue({
        name: params['name'] || '',
        email: params['email'] || '',
        phone: params['phone'] || '',
        address: params['address'] || '',
        date: params['date'] || '',
        time: params['time'] || ''
      });
    });

    // --- NEW: Load logged client data if exists ---
    const clientId = localStorage.getItem('loggedClient');
    if (clientId) {
      this.clientService.getClients().subscribe(clients => {
        const client = clients.find(c => c.id === clientId);
        if (client) {
          this.informationForm.patchValue({
            name: client.name,
            email: client.email,
            phone: client.phone,
            address: client.address
          });
        }
      });
    } else {
      // If no logged client but there's an email in localStorage, prefill only the email
      const emailLogin = localStorage.getItem('emailLogin');
      if (emailLogin) {
        this.informationForm.patchValue({
          email: emailLogin
        });
      }
    }
  }

  onSubmit(): void {
    if (this.informationForm.valid) {
      this.isSubmitting = true;

      const formValue = this.informationForm.value;
      const params = this.route.snapshot.queryParams;
      const clientId = localStorage.getItem('loggedClient');
      const appointmentId = localStorage.getItem('appointmentInProcess');
      const emailLogin = localStorage.getItem('emailLogin');

      const navigateToSummary = (newClientId?: string) => {
        // If there's an appointment in process, update its clientId
        if (appointmentId && newClientId) {
          this.appointmentService.updateClientInAppointment(appointmentId, newClientId);
          localStorage.removeItem('appointmentInProcess');
        }

        this.router.navigate(['/resumen-cita'], { // Keep Spanish route for compatibility
          queryParams: {
            brand: this.selectedBrand,
            product: this.selectedProduct,
            model: this.selectedModel,
            symptoms: this.selectedSymptoms,
            location: this.selectedLocation,
            date: formValue.date,
            time: formValue.time,
            name: formValue.name,
            email: formValue.email,
            phone: formValue.phone,
            address: formValue.address,
            technicianId: params['technicianId'] || '',
            serviceId: params['serviceId'] || ''
          }
        });
      };

      if (clientId) {
        // Update client data in backend
        this.clientService.updateClient(clientId, {
          name: formValue.name,
          email: formValue.email,
          phone: formValue.phone,
          address: formValue.address
        }).subscribe({
          next: () => navigateToSummary(),
          error: () => navigateToSummary() // If it fails, still navigate
        });
      } else {
        // If no logged client, simply navigate to summary
        // This will allow creating the client during final appointment confirmation
        navigateToSummary();
      }
    }
  }

  goBack(): void {
    // Go back to technicians page with service and client data (using English route)
    this.router.navigate(['/technicians'], {
      queryParams: {
        service: this.route.snapshot.queryParams['service'] || '1',
        brand: this.selectedBrand,
        product: this.selectedProduct,
        model: this.selectedModel,
        symptoms: this.selectedSymptoms,
        location: this.selectedLocation,
        date: this.informationForm.get('date')?.value || '',
        time: this.informationForm.get('time')?.value || ''
      }
    });
  }
}
