import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CitaService } from '../../services/cita.service';
import { ClienteService } from '../../services/cliente.service';
import { TecnicoService } from '../../services/tecnico.service';
import { Cliente, Cita, Tecnico } from '../../models';
import { switchMap } from 'rxjs/operators';
import { AppComponent } from '../../app.component';

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
    private tecnicoService: TecnicoService,
    private appComponent: AppComponent
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
    this.router.navigate(['/clientes'], {
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

    // Primero verificar si el cliente ya existe
    this.clienteService.getClientes().pipe(
      switchMap(clientes => {
        const clienteExistente = clientes.find(c => c.email === this.email);

        if (clienteExistente) {
          // Si el cliente existe, usar el existente
          return [clienteExistente];
        } else {
          // Si no existe, crear uno nuevo
          const cliente: Omit<Cliente, 'id'> = {
            nombre: this.nombre,
            email: this.email,
            telefono: this.telefono,
            direccion: this.direccion
          };
          return this.clienteService.agregarCliente(cliente);
        }
      }),
      switchMap(cliente => {
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
          clienteId: cliente.id,
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

      // Guardar IDs en localStorage
      localStorage.setItem('clienteLogueado', nuevaCita.clienteId);
      localStorage.setItem('citaEnProceso', nuevaCita.id);

      // Actualizar el navbar inmediatamente
      this.appComponent.actualizarEstadoUsuario();

      alert('¡Cita agendada exitosamente!');

      // Redirigir a mis-citas con el clienteId
      this.router.navigate(['/mis-citas'], { queryParams: { clienteId: nuevaCita.clienteId } });
    });
  }
}
