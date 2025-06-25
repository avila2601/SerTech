import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CitaService } from '../../services/cita.service';
import { ServicioService } from '../../services/servicio.service';
import { TecnicoService } from '../../services/tecnico.service';
import { ClienteService } from '../../services/cliente.service';
import { Cita, Servicio, Tecnico, Cliente, EstadoCita } from '../../models';

@Component({
  selector: 'app-mis-citas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-citas.component.html',
  styleUrls: ['./mis-citas.component.scss']
})
export class MisCitasComponent implements OnInit {
  citas: Cita[] = [];
  citasFiltradas: Cita[] = [];
  servicios: Servicio[] = [];
  tecnicos: Tecnico[] = [];
  clientes: Cliente[] = [];
  estados = Object.values(EstadoCita);
  estadoSeleccionado: EstadoCita | null = null;
  EstadoCita = EstadoCita;
  clienteIdActual: string = '1'; // Por defecto

  constructor(
    private citaService: CitaService,
    private servicioService: ServicioService,
    private tecnicoService: TecnicoService,
    private clienteService: ClienteService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Obtener el ID del cliente desde query params
    this.route.queryParams.subscribe(params => {
      if (params['clienteId']) {
        this.clienteIdActual = params['clienteId'];
      }
      this.cargarDatos();
    });
  }

  cargarDatos(): void {
    // Cargar citas del cliente actual
    this.citaService.getCitasPorCliente(this.clienteIdActual).subscribe(citas => {
      this.citas = citas;
      this.citasFiltradas = citas;
    });

    this.servicioService.getServicios().subscribe(servicios => {
      this.servicios = servicios;
    });

    this.tecnicoService.getTecnicos().subscribe(tecnicos => {
      this.tecnicos = tecnicos;
    });

    this.clienteService.getClientes().subscribe(clientes => {
      this.clientes = clientes;
    });
  }

  filtrarPorEstado(estado: EstadoCita): void {
    this.estadoSeleccionado = estado;
    this.citasFiltradas = this.citas.filter(c => c.estado === estado);
  }

  getEstadoClass(estado: EstadoCita): string {
    return estado.toLowerCase().replace(' ', '-');
  }

  formatDate(fecha: Date): string {
    // Asegurar que la fecha se maneje correctamente
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getServicioNombre(servicioId: string): string {
    const servicio = this.servicios.find(s => s.id === servicioId);
    return servicio ? servicio.nombre : 'Servicio no encontrado';
  }

  getTecnicoNombre(tecnicoId: string): string {
    const tecnico = this.tecnicos.find(t => t.id === tecnicoId);
    return tecnico ? tecnico.nombre : 'No asignado';
  }

  getTecnicoEspecialidad(tecnicoId: string): string {
    const tecnico = this.tecnicos.find(t => t.id === tecnicoId);
    return tecnico ? tecnico.especialidad : 'No asignado';
  }

  getTecnicoCalificacion(tecnicoId: string): number {
    const tecnico = this.tecnicos.find(t => t.id === tecnicoId);
    return tecnico ? tecnico.calificacion : 0;
  }

  getClienteNombre(clienteId: string): string {
    const cliente = this.clientes.find(c => c.id === clienteId);
    return cliente ? cliente.nombre : 'No disponible';
  }

  getClienteEmail(clienteId: string): string {
    const cliente = this.clientes.find(c => c.id === clienteId);
    return cliente ? cliente.email : 'No disponible';
  }

  getClienteTelefono(clienteId: string): string {
    const cliente = this.clientes.find(c => c.id === clienteId);
    return cliente ? cliente.telefono : 'No disponible';
  }

  getClienteDireccion(clienteId: string): string {
    const cliente = this.clientes.find(c => c.id === clienteId);
    return cliente ? cliente.direccion : 'No disponible';
  }

  getServicioInfo(cita: Cita): any {
    try {
      if (cita.notas) {
        return JSON.parse(cita.notas);
      }
    } catch (error) {
      console.error('Error parsing service info:', error);
    }
    return {};
  }

  cancelarCita(citaId: string): void {
    if (confirm('¿Estás seguro de que quieres cancelar esta cita?')) {
      this.citaService.cancelarCita(citaId);
      this.cargarDatos(); // Recargar datos
    }
  }

  reprogramarCita(cita: Cita): void {
    // Extraer información del servicio desde las notas
    let infoServicio = {
      marca: '',
      producto: '',
      modelo: '',
      sintomas: '',
      ubicacion: ''
    };

    if (cita.notas) {
      try {
        const notasParsed = JSON.parse(cita.notas);
        infoServicio = {
          marca: notasParsed.marca || '',
          producto: notasParsed.producto || '',
          modelo: notasParsed.modelo || '',
          sintomas: notasParsed.sintomas || '',
          ubicacion: notasParsed.ubicacion || ''
        };
      } catch (e) {
        infoServicio.sintomas = cita.notas;
      }
    }

    // Buscar el cliente para obtener sus datos personales
    const cliente = this.clientes.find(c => c.id === cita.clienteId);

    this.router.navigate(['/agendar'], {
      queryParams: {
        marca: infoServicio.marca,
        producto: infoServicio.producto,
        modelo: infoServicio.modelo,
        sintomas: infoServicio.sintomas,
        ubicacion: infoServicio.ubicacion,
        nombre: cliente?.nombre || '',
        email: cliente?.email || '',
        telefono: cliente?.telefono || '',
        direccion: cliente?.direccion || '',
        fecha: cita.fecha ? new Date(cita.fecha).toISOString().split('T')[0] : '',
        hora: cita.hora || ''
      }
    });
  }

  agendarNuevoServicio(): void {
    this.router.navigate(['/agendar']);
  }
}
