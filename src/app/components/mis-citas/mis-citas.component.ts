import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CitaService } from '../../services/cita.service';
import { ServicioService } from '../../services/servicio.service';
import { TecnicoService } from '../../services/tecnico.service';
import { ClienteService } from '../../services/cliente.service';
import { ResenaService } from '../../services/resena.service';
import { Cita, Servicio, Tecnico, Cliente } from '../../models';
import { ResenasComponent } from '../resenas/resenas.component';

@Component({
  selector: 'app-mis-citas',
  standalone: true,
  imports: [CommonModule, ResenasComponent],
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
  mostrarModalResena = false;
  tecnicoIdResena = '';
  clienteIdResena = '';
  clienteNombreResena = '';
  citasEvaluadas: Set<string> = new Set(); // Para trackear citas ya evaluadas

  constructor(
    private citaService: CitaService,
    private servicioService: ServicioService,
    private tecnicoService: TecnicoService,
    private clienteService: ClienteService,
    private resenaService: ResenaService,
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
        const emailLogin = localStorage.getItem('emailLogin');

        if (tecnicoLogueado) {
          this.tecnicoIdActual = tecnicoLogueado;
          this.clienteIdActual = null;
        } else if (clienteLogueado) {
          this.clienteIdActual = clienteLogueado;
          this.tecnicoIdActual = null;
        } else if (emailLogin) {
          // Si hay un email guardado, filtrar por ese email
          this.clienteService.getClientes().subscribe(clientes => {
            const clienteConEmail = clientes.find(c => c.email === emailLogin);
            this.clienteIdActual = clienteConEmail ? clienteConEmail.id : emailLogin;
            this.tecnicoIdActual = null;
            this.cargarDatos();
          });
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
        const emailLogin = localStorage.getItem('emailLogin');
        if (emailLogin) {
          // Si hay emailLogin, mostrar solo las citas donde el email coincide
          this.citas = citas.filter(c => {
            const cliente = this.clientes.find(cl => cl.id === c.clienteId);
            return cliente?.email === emailLogin;
          });
        } else {
          // Si hay clienteId, mostrar solo las citas de ese cliente
          this.citas = citas.filter(c => c.clienteId === this.clienteIdActual);
        }
      } else {
        this.citas = []; // No mostrar citas si no hay filtro válido
      }
      this.citasFiltradas = this.citas;
      this.verificarCitasEvaluadas();
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

  verificarCitasEvaluadas(): void {
    // Verificar qué citas ya han sido evaluadas
    this.citasFiltradas.forEach(cita => {
      if (this.getEstadoCita(cita) === 'Terminada') {
        const tecnicoId = cita.tecnicoId;
        const clienteId = cita.clienteId;
        const clienteNombre = this.getClienteNombre(cita.clienteId);

        this.resenaService.existeResena(tecnicoId, clienteId, clienteNombre).subscribe(existe => {
          if (existe) {
            this.citasEvaluadas.add(cita.id);
          }
        });
      }
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

  getEstadoCita(cita: Cita): string {
    const fechaCita = new Date(cita.fecha);
    const fechaActual = new Date();

    // Si la fecha de la cita ya pasó, mostrar "Terminada"
    if (fechaCita < fechaActual) {
      return 'Terminada';
    }

    // Si la fecha es futura, mostrar "Pendiente"
    return 'Pendiente';
  }

  getEstadoCitaClass(cita: Cita): string {
    const estado = this.getEstadoCita(cita);
    return estado === 'Pendiente' ? 'estado-pendiente' : 'estado-terminada';
  }

  yaFueEvaluada(cita: Cita): boolean {
    return this.citasEvaluadas.has(cita.id);
  }

  abrirModalResena(cita: Cita) {
    this.tecnicoIdResena = cita.tecnicoId;
    this.clienteIdResena = cita.clienteId;
    this.clienteNombreResena = this.getClienteNombre(cita.clienteId);
    this.mostrarModalResena = true;
  }

  cerrarModalResena() {
    this.mostrarModalResena = false;
    // Recargar las citas evaluadas después de cerrar el modal
    this.verificarCitasEvaluadas();
  }

  onResenaEnviada() {
    // Marcar la cita actual como evaluada
    const citaActual = this.citasFiltradas.find(cita =>
      cita.tecnicoId === this.tecnicoIdResena &&
      cita.clienteId === this.clienteIdResena
    );

    if (citaActual) {
      this.citasEvaluadas.add(citaActual.id);
    }
  }
}
