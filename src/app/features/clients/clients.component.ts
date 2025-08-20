import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  UpdateClientInformationUseCase,
  LoadClientFormDataUseCase,
  NavigateToAppointmentSummaryUseCase
} from '../../core/application/use-cases/clients';

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

  // Use Cases
  private readonly fb = inject(FormBuilder);
  private readonly updateClientInformationUseCase = inject(UpdateClientInformationUseCase);
  private readonly loadClientFormDataUseCase = inject(LoadClientFormDataUseCase);
  private readonly navigateToAppointmentSummaryUseCase = inject(NavigateToAppointmentSummaryUseCase);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  constructor() {
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

    // Load client data using Clean Architecture
    this.loadClientFormDataUseCase.execute().subscribe({
      next: (clientData) => {
        if (clientData) {
          this.informationForm.patchValue(clientData);
        }
      },
      error: (error) => {
        console.error('Error loading client form data:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.informationForm.valid) {
      this.isSubmitting = true;

      const formValue = this.informationForm.value;
      const params = this.route.snapshot.queryParams;

      // Update client information using Clean Architecture
      this.updateClientInformationUseCase.execute(formValue).subscribe({
        next: (result) => {
          if (result.success) {
            // Navigate to appointment summary
            const navigationParams = {
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
            };

            this.navigateToAppointmentSummaryUseCase.execute(navigationParams).subscribe({
              next: () => {
                this.isSubmitting = false;
              },
              error: (error) => {
                console.error('Error navigating:', error);
                this.isSubmitting = false;
              }
            });
          } else {
            console.error('Error updating client:', result.message);
            this.isSubmitting = false;
          }
        },
        error: (error) => {
          console.error('Error in client update process:', error);
          this.isSubmitting = false;
        }
      });
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
