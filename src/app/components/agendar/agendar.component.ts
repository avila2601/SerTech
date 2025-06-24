import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CitaService } from '../../services/cita.service';
import { ClienteService } from '../../services/cliente.service';
import { Cliente, Cita } from '../../models';

@Component({
  selector: 'app-agendar',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './agendar.component.html',
  styleUrls: ['./agendar.component.scss']
})
export class AgendarComponent implements OnInit {
  agendarForm: FormGroup;
  horasDisponibles = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];
  minDate: string;
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
    this.agendarForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required]
    });

    // Fecha mínima es hoy
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    // Obtener los datos del servicio seleccionado desde query params
    this.route.queryParams.subscribe(params => {
      this.marcaSeleccionada = params['marca'] || '';
      this.productoSeleccionado = params['producto'] || '';
      this.modeloSeleccionado = params['modelo'] || '';
      this.sintomasSeleccionados = params['sintomas'] || '';
      this.ubicacionSeleccionada = params['ubicacion'] || '';
    });
  }

  onSubmit(): void {
    if (this.agendarForm.valid) {
      this.isSubmitting = true;

      const formValue = this.agendarForm.value;

      // Crear cliente
      const cliente: Omit<Cliente, 'id'> = {
        nombre: formValue.nombre,
        email: formValue.email,
        telefono: formValue.telefono,
        direccion: formValue.direccion
      };

      const nuevoCliente = this.clienteService.agregarCliente(cliente);

      // Crear cita simplificada
      const cita: Omit<Cita, 'id' | 'estado'> = {
        clienteId: nuevoCliente.id,
        tecnicoId: '1', // Técnico por defecto
        servicioId: '1', // Servicio por defecto
        fecha: new Date(formValue.fecha),
        hora: formValue.hora,
        notas: this.sintomasSeleccionados,
        direccion: formValue.direccion
      };

      const nuevaCita = this.citaService.crearCita(cita);

      // Simular delay
      setTimeout(() => {
        this.isSubmitting = false;
        alert('¡Servicio agendado exitosamente!');
        this.router.navigate(['/mis-citas']);
      }, 1000);
    }
  }

  cancelar(): void {
    this.router.navigate(['/']);
  }
}
