import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CitaService } from '../../services/cita.service';
import { ServicioService } from '../../services/servicio.service';
import { TecnicoService } from '../../services/tecnico.service';
import { ClienteService } from '../../services/cliente.service';
import { Cita, Servicio, Tecnico, Cliente } from '../../models';

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
  clienteIdActual: string | null = null; // Por defecto, sin filtro
  tecnicoIdActual: string | null = null;

  constructor(
    private citaService: CitaService,
    private servicioService: ServicioService,
    private tecnicoService: TecnicoService,
    private clienteService: ClienteService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Obtener el ID del cliente o del técnico desde query params o localStorage
    this.route.queryParams.subscribe(params => {
      if (params['clienteId']) {
        this.clienteIdActual = params['clienteId'];
        this.tecnicoIdActual = null;
      } else if (params['tecnicoId']) {
        this.tecnicoIdActual = params['tecnicoId'];
        this.clienteIdActual = null;
      } else {
        // Si no hay query params, verificar localStorage
        const tecnicoLogueado = localStorage.getItem('tecnicoLogueado');
        const clienteLogueado = localStorage.getItem('clienteLogueado');

        if (tecnicoLogueado) {
          this.tecnicoIdActual = tecnicoLogueado;
          this.clienteIdActual = null;
        } else if (clienteLogueado) {
          this.clienteIdActual = clienteLogueado;
          this.tecnicoIdActual = null;
        } else {
          this.clienteIdActual = null;
          this.tecnicoIdActual = null;
        }
      }
      this.cargarDatos();
    });
  }

  cargarDatos(): void {
    this.citaService.getCitas().subscribe(citas => {
      if (this.tecnicoIdActual) {
        this.citas = citas.filter(c => String(c.tecnicoId) === String(this.tecnicoIdActual));
      } else if (this.clienteIdActual) {
        this.citas = citas.filter(c => c.clienteId === this.clienteIdActual);
      } else {
        this.citas = citas; // Mostrar todas si no hay filtro
      }
      this.citasFiltradas = this.citas;
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
}
