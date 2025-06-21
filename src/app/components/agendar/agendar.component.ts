import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServicioService } from '../../services/servicio.service';
import { TecnicoService } from '../../services/tecnico.service';
import { CitaService } from '../../services/cita.service';
import { ClienteService } from '../../services/cliente.service';
import { Servicio, Tecnico, Cliente, Cita, TipoEquipo } from '../../models';

@Component({
  selector: 'app-agendar',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './agendar.component.html',
  styleUrls: ['./agendar.component.scss']
})
export class AgendarComponent implements OnInit {
  agendarForm: FormGroup;
  servicios: Servicio[] = [];
  tecnicos: Tecnico[] = [];
  tiposEquipo = Object.values(TipoEquipo);
  horasDisponibles = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];
  minDate: string;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private servicioService: ServicioService,
    private tecnicoService: TecnicoService,
    private citaService: CitaService,
    private clienteService: ClienteService,
    private router: Router
  ) {
    this.agendarForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      servicioId: ['', Validators.required],
      tecnicoId: ['', Validators.required],
      tipoEquipo: [''],
      marca: [''],
      modelo: [''],
      descripcion: [''],
      fecha: ['', Validators.required],
      hora: ['', Validators.required]
    });

    // Fecha mínima es hoy
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.cargarServicios();
    this.cargarTecnicos();
  }

  cargarServicios(): void {
    this.servicioService.getServicios().subscribe(servicios => {
      this.servicios = servicios;
    });
  }

  cargarTecnicos(): void {
    this.tecnicoService.getTecnicosDisponibles().subscribe(tecnicos => {
      this.tecnicos = tecnicos;
    });
  }

  seleccionarTecnico(tecnicoId: string): void {
    this.agendarForm.patchValue({ tecnicoId });
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

      // Crear cita
      const cita: Omit<Cita, 'id' | 'estado'> = {
        clienteId: nuevoCliente.id,
        tecnicoId: formValue.tecnicoId,
        servicioId: formValue.servicioId,
        fecha: new Date(formValue.fecha),
        hora: formValue.hora,
        notas: formValue.descripcion,
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
