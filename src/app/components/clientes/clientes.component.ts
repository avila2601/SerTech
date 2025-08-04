import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {
  informationForm: FormGroup;
  isSubmitting = false;

  // Información del servicio seleccionado
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
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      fecha: [''],
      hora: ['']
    });
  }

  ngOnInit(): void {
    // Obtener los datos del servicio seleccionado y personales desde query params
    this.route.queryParams.subscribe(params => {
      this.selectedBrand = params['marca'] || '';
      this.selectedProduct = params['producto'] || '';
      this.selectedModel = params['modelo'] || '';
      this.selectedSymptoms = params['sintomas'] || '';
      this.selectedLocation = params['ubicacion'] || '';

      // Rellenar el formulario si existen datos personales y de fecha/hora
      this.informationForm.patchValue({
        nombre: params['nombre'] || '',
        email: params['email'] || '',
        telefono: params['telefono'] || '',
        direccion: params['direccion'] || '',
        fecha: params['fecha'] || '',
        hora: params['hora'] || ''
      });
    });

    // --- NUEVO: Cargar datos del cliente logueado si existe ---
    const clienteId = localStorage.getItem('clienteLogueado');
    if (clienteId) {
      this.clientService.getClients().subscribe((clients: Client[]) => {
        const client = clients.find(c => c.id === clienteId);
        if (client) {
          this.informationForm.patchValue({
            nombre: client.name,
            email: client.email,
            telefono: client.phone,
            direccion: client.address
          });
        }
      });
    } else {
      // Si no hay cliente logueado pero hay un email en localStorage, prellenar solo el email
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
      const clienteId = localStorage.getItem('clienteLogueado');
      const citaId = localStorage.getItem('citaEnProceso');
      const emailLogin = localStorage.getItem('emailLogin');

      const navigateToSummary = (newClientId?: string) => {
        // Si hay una cita en proceso, actualizar su clienteId
        if (citaId && newClientId) {
          this.appointmentService.updateClientInAppointment(citaId, newClientId);
          localStorage.removeItem('citaEnProceso');
        }

        this.router.navigate(['/resumen-cita'], {
          queryParams: {
            marca: this.selectedBrand,
            producto: this.selectedProduct,
            modelo: this.selectedModel,
            sintomas: this.selectedSymptoms,
            ubicacion: this.selectedLocation,
            fecha: formValue.fecha,
            hora: formValue.hora,
            nombre: formValue.nombre,
            email: formValue.email,
            telefono: formValue.telefono,
            direccion: formValue.direccion,
            tecnicoId: params['tecnicoId'] || '',
            servicioId: params['servicioId'] || ''
          }
        });
      };

      if (clienteId) {
        // Actualizar datos del cliente en el backend
        this.clientService.updateClient(clienteId, {
          name: formValue.nombre,
          email: formValue.email,
          phone: formValue.telefono,
          address: formValue.direccion
        }).subscribe({
          next: () => navigateToSummary(),
          error: () => navigateToSummary() // Si falla, igual navega
        });
      } else {
        // Si no hay cliente logueado, simplemente navegar al resumen
        // Esto permitirá crear el cliente durante la confirmación final de la cita
        navigateToSummary();
      }
    }
  }

  goBack(): void {
    // Regresar a la página de técnicos con los datos del servicio y cliente
    this.router.navigate(['/tecnicos'], {
      queryParams: {
        servicio: this.route.snapshot.queryParams['servicio'] || '1',
        marca: this.selectedBrand,
        producto: this.selectedProduct,
        modelo: this.selectedModel,
        sintomas: this.selectedSymptoms,
        ubicacion: this.selectedLocation,
        fecha: this.informationForm.get('fecha')?.value || '',
        hora: this.informationForm.get('hora')?.value || ''
      }
    });
  }
}
