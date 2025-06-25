import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CitaService } from '../../services/cita.service';
import { ClienteService } from '../../services/cliente.service';
import { Cliente, Cita } from '../../models';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private citaService: CitaService,
    private clienteService: ClienteService
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
    });
  }

  regresar(): void {
    // Navegar de vuelta al componente agendar preservando todos los datos
    this.router.navigate(['/agendar'], {
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
    if (!this.nombre || !this.email || !this.telefono || !this.direccion || !this.fecha || !this.hora) {
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

    const nuevoCliente = this.clienteService.agregarCliente(cliente);

    // Guardar toda la información del servicio en las notas como JSON
    const infoServicio = {
      marca: this.marca,
      producto: this.producto,
      modelo: this.modelo,
      sintomas: this.sintomas,
      ubicacion: this.ubicacion
    };

    // Corregir el manejo de fecha para evitar problemas de zona horaria
    const fechaSeleccionada = new Date(this.fecha + 'T00:00:00');

    const cita: Omit<Cita, 'id' | 'estado'> = {
      clienteId: nuevoCliente.id,
      tecnicoId: '1', // Técnico por defecto
      servicioId: '1', // Servicio por defecto
      fecha: fechaSeleccionada,
      hora: this.hora,
      notas: JSON.stringify(infoServicio),
      direccion: this.direccion
    };

    const nuevaCita = this.citaService.crearCita(cita);

    // Simular delay
    setTimeout(() => {
      this.isAgendando = false;
      alert('¡Cita agendada exitosamente!');
      this.router.navigate(['/mis-citas'], {
        queryParams: { clienteId: nuevoCliente.id }
      });
    }, 1000);
  }
}
