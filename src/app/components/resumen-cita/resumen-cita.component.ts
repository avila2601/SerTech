import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CitaService } from '../../services/cita.service';
import { ClienteService } from '../../services/cliente.service';
import { TecnicoService } from '../../services/tecnico.service';
import { Cliente, Cita, Tecnico } from '../../models';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-resumen-cita',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resumen-cita.component.html',
  styleUrls: ['./resumen-cita.component.scss']
})
export class ResumenCitaComponent implements OnInit {
  // Datos del servicio y personales
  marca: string = '';
  producto: string = '';
  modelo: string = '';
  sintomas: string = '';
  ubicacion: string = '';
  fecha: string = '';
  hora: string = '';
  nombre: string = '';
  email: string = '';
  telefono: string = '';
  direccion: string = '';
  isAgendando: boolean = false;
  tecnicoId: string = '';
  servicioId: string = '';

  // Información del técnico
  tecnico: Tecnico | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private citaService: CitaService,
    private clienteService: ClienteService,
    private tecnicoService: TecnicoService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.marca = params['marca'] || '';
      this.producto = params['producto'] || '';
      this.modelo = params['modelo'] || '';
      this.sintomas = params['sintomas'] || '';
      this.ubicacion = params['ubicacion'] || '';
      this.fecha = params['fecha'] || '';
      this.hora = params['hora'] || '';
      this.nombre = params['nombre'] || '';
      this.email = params['email'] || '';
      this.telefono = params['telefono'] || '';
      this.direccion = params['direccion'] || '';
      this.tecnicoId = params['tecnicoId'] || '';
      this.servicioId = params['servicioId'] || '';

      // Cargar información del técnico si hay tecnicoId
      if (this.tecnicoId) {
        this.cargarInformacionTecnico();
      }
    });
  }

  cargarInformacionTecnico(): void {
    this.tecnicoService.getTecnicoById(this.tecnicoId).subscribe(tecnico => {
      this.tecnico = tecnico || null;
    });
  }

  regresar(): void {
    // Navegar de vuelta al componente información personal preservando todos los datos
    this.router.navigate(['/informacion-personal'], {
      queryParams: {
        marca: this.marca,
        producto: this.producto,
        modelo: this.modelo,
        sintomas: this.sintomas,
        ubicacion: this.ubicacion,
        fecha: this.fecha,
        hora: this.hora,
        nombre: this.nombre,
        email: this.email,
        telefono: this.telefono,
        direccion: this.direccion
      }
    });
  }

  agendarCita(): void {
    if (!this.nombre || !this.email || !this.telefono || !this.direccion) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    this.isAgendando = true;

    // Crear cliente
    const cliente: Omit<Cliente, 'id'> = {
      nombre: this.nombre,
      email: this.email,
      telefono: this.telefono,
      direccion: this.direccion
    };

    this.clienteService.agregarCliente(cliente).pipe(
      switchMap(nuevoCliente => {
        // Guardar toda la información del servicio en las notas como JSON
        const infoServicio = {
          marca: this.marca,
          producto: this.producto,
          modelo: this.modelo,
          sintomas: this.sintomas,
          ubicacion: this.ubicacion
        };

        // Manejar fecha y hora opcionales
        let fechaSeleccionada: Date;
        if (this.fecha) {
          fechaSeleccionada = new Date(this.fecha + 'T00:00:00');
        } else {
          fechaSeleccionada = new Date();
        }

        const cita: Omit<Cita, 'id' | 'estado'> = {
          clienteId: nuevoCliente.id,
          tecnicoId: this.tecnicoId,
          servicioId: this.servicioId,
          fecha: fechaSeleccionada,
          hora: this.hora || 'Por coordinar',
          notas: JSON.stringify(infoServicio),
          direccion: this.direccion
        };
        return this.citaService.crearCita(cita);
      })
    ).subscribe(nuevaCita => {
      this.isAgendando = false;
      alert('¡Cita agendada exitosamente!');
      this.router.navigate(['/']);
    });
  }
}
