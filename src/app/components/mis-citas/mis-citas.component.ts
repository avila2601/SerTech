import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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

  constructor(
    private citaService: CitaService,
    private servicioService: ServicioService,
    private tecnicoService: TecnicoService,
    private clienteService: ClienteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    // Cargar citas (simulando que el cliente actual tiene ID '1')
    this.citaService.getCitasPorCliente('1').subscribe(citas => {
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
    return new Date(fecha).toLocaleDateString('es-ES', {
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
    return tecnico ? tecnico.nombre : 'Técnico no encontrado';
  }

  cancelarCita(citaId: string): void {
    if (confirm('¿Estás seguro de que quieres cancelar esta cita?')) {
      this.citaService.cancelarCita(citaId);
      this.cargarDatos(); // Recargar datos
    }
  }

  reprogramarCita(cita: Cita): void {
    this.router.navigate(['/agendar'], {
      queryParams: {
        servicioId: cita.servicioId,
        tecnicoId: cita.tecnicoId
      }
    });
  }

  agendarNuevoServicio(): void {
    this.router.navigate(['/agendar']);
  }
}
