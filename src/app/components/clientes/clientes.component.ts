import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CitaService } from '../../services/cita.service';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {
  informacionForm: FormGroup;
  isSubmitting = false;

  // Información del servicio seleccionado
  marcaSeleccionada: string = '';
  productoSeleccionado: string = '';
  modeloSeleccionado: string = '';
  sintomasSeleccionados: string = '';
  ubicacionSeleccionada: string = '';

  constructor(
    private fb: FormBuilder,
    private citaService: CitaService,
    private clienteService: ClienteService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.informacionForm = this.fb.group({
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
      this.marcaSeleccionada = params['marca'] || '';
      this.productoSeleccionado = params['producto'] || '';
      this.modeloSeleccionado = params['modelo'] || '';
      this.sintomasSeleccionados = params['sintomas'] || '';
      this.ubicacionSeleccionada = params['ubicacion'] || '';

      // Rellenar el formulario si existen datos personales y de fecha/hora
      this.informacionForm.patchValue({
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
      this.clienteService.getClientes().subscribe(clientes => {
        const cliente = clientes.find(c => c.id === clienteId);
        if (cliente) {
          this.informacionForm.patchValue({
            nombre: cliente.nombre,
            email: cliente.email,
            telefono: cliente.telefono,
            direccion: cliente.direccion
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
      const clienteId = localStorage.getItem('clienteLogueado');
      const citaId = localStorage.getItem('citaEnProceso');
      const emailLogin = localStorage.getItem('emailLogin');

      const navegarAResumen = (nuevoClienteId?: string) => {
        // Si hay una cita en proceso, actualizar su clienteId
        if (citaId && nuevoClienteId) {
          this.citaService.actualizarClienteEnCita(citaId, nuevoClienteId);
          localStorage.removeItem('citaEnProceso');
        }

        this.router.navigate(['/resumen-cita'], {
          queryParams: {
            marca: this.marcaSeleccionada,
            producto: this.productoSeleccionado,
            modelo: this.modeloSeleccionado,
            sintomas: this.sintomasSeleccionados,
            ubicacion: this.ubicacionSeleccionada,
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
        this.clienteService.actualizarCliente(clienteId, {
          nombre: formValue.nombre,
          email: formValue.email,
          telefono: formValue.telefono,
          direccion: formValue.direccion
        }).subscribe({
          next: () => navegarAResumen(),
          error: () => navegarAResumen() // Si falla, igual navega
        });
      } else {
        // Si no hay cliente logueado, simplemente navegar al resumen
        // Esto permitirá crear el cliente durante la confirmación final de la cita
        navegarAResumen();
      }
    }
  }

  regresar(): void {
    // Regresar a la página de técnicos con los datos del servicio y cliente
    this.router.navigate(['/tecnicos'], {
      queryParams: {
        servicio: this.route.snapshot.queryParams['servicio'] || '1',
        marca: this.marcaSeleccionada,
        producto: this.productoSeleccionado,
        modelo: this.modeloSeleccionado,
        sintomas: this.sintomasSeleccionados,
        ubicacion: this.ubicacionSeleccionada,
        fecha: this.informacionForm.get('fecha')?.value || '',
        hora: this.informacionForm.get('hora')?.value || ''
      }
    });
  }
}
