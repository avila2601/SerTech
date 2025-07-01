import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ServicioService } from '../../services/servicio.service';
import { Servicio, CategoriaServicio } from '../../models';

interface ServicioCard {
  tipo: string;
  titulo: string;
  descripcion: string;
  icono: string;
}

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.scss']
})
export class ServiciosComponent implements OnInit {
  servicioSeleccionado: Servicio | null = null;
  marcaSeleccionada: string = '';
  productoSeleccionado: string = '';
  modeloSeleccionado: string = '';
  mostrarModalModelo: boolean = false;
  sintomas: string = '';
  ubicacionSeleccionada: string = '';
  fechaSeleccionada: string = '';
  horaSeleccionada: string = '';
  minDate: string;
  horasDisponibles = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];
  ubicaciones: string[] = [
    'Cerrillos', 'Cerro Navia', 'Conchalí', 'El Bosque', 'Estación Central',
    'Huechuraba', 'Independencia', 'La Cisterna', 'La Florida', 'La Granja',
    'La Pintana', 'La Reina', 'Las Condes', 'Lo Barnechea', 'Lo Espejo',
    'Lo Prado', 'Macul', 'Maipú', 'Ñuñoa', 'Pedro Aguirre Cerda',
    'Peñalolén', 'Providencia', 'Pudahuel', 'Puente Alto', 'Quilicura',
    'Quinta Normal', 'Recoleta', 'Renca', 'San Joaquín', 'San Miguel',
    'San Ramón', 'Santiago (Centro)', 'Vitacura', 'El Monte', 'Padre Hurtado'
  ];

  marcas: string[] = [
    'Samsung', 'LG', 'Whirlpool', 'Mabe', 'Electrolux',
    'Panasonic', 'Sony', 'Philips', 'Bosch', 'Frigidaire',
    'GE', 'Maytag', 'KitchenAid', 'Kenmore', 'Amana'
  ];

  productos: string[] = [
    'Refrigerador', 'Lavadora', 'Secadora', 'Microondas', 'Horno',
    'Lavavajillas', 'Cafetera', 'Licuadora', 'Batidora', 'Tostadora',
    'Aspiradora', 'Ventilador', 'Aire acondicionado', 'Televisor', 'Estéreo'
  ];

  modelos: string[] = [
    'RF-2023-A', 'LG-WM-4500', 'WH-SD-789', 'MB-FR-321', 'EL-MW-567',
    'PN-TV-890', 'SN-BT-234', 'PH-AC-456', 'BS-DW-789', 'FG-RF-123',
    'GE-LV-567', 'MY-DR-890', 'KA-MX-234', 'KM-WM-456', 'AM-TV-789'
  ];

  private serviciosDisponibles: ServicioCard[] = [
    {
      tipo: 'mantenimiento',
      titulo: 'Mantenimiento',
      descripcion: 'Mantenimiento preventivo de tu equipo',
      icono: '🔧'
    },
    {
      tipo: 'reparacion',
      titulo: 'Reparación',
      descripcion: 'Tu equipo tiene un daño? lo reparamos',
      icono: '🔧'
    },
    {
      tipo: 'instalacion',
      titulo: 'Instalación',
      descripcion: 'Instalación y configuración',
      icono: '⚙️'
    }
  ];

  iconoServicio: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private servicioService: ServicioService
  ) {
    // Fecha mínima es hoy
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      // Manejar datos que vienen desde agendar (regresar)
      if (params['marca']) {
        this.marcaSeleccionada = params['marca'];
        this.productoSeleccionado = params['producto'] || '';
        this.modeloSeleccionado = params['modelo'] || '';
        this.sintomas = params['sintomas'] || '';
        this.ubicacionSeleccionada = params['ubicacion'] || '';
        this.fechaSeleccionada = params['fecha'] || '';
        this.horaSeleccionada = params['hora'] || '';

        // Si no hay servicio seleccionado, seleccionar uno por defecto
        if (!this.servicioSeleccionado) {
          this.servicioService.getServiciosPorCategoria(CategoriaServicio.REPARACION).subscribe(servicios => {
            if (servicios && servicios.length > 0) {
              this.servicioSeleccionado = servicios[0];
            }
          });
        }
      }

      // Manejar selección desde home
      const tipoServicio = params['tipo'];
      if (tipoServicio) {
        // Mapear el tipo de servicio a la categoría correspondiente
        const categoria = this.mapearTipoACategoria(tipoServicio);
        if (categoria) {
          // Obtener el primer servicio de esa categoría
          this.servicioService.getServiciosPorCategoria(categoria).subscribe(servicios => {
            if (servicios && servicios.length > 0) {
              this.servicioSeleccionado = servicios[0];
            }
          });
        }
      }
      // Guardar el icono recibido
      if (params['icono']) {
        this.iconoServicio = params['icono'];
      }
    });
  }

  private mapearTipoACategoria(tipo: string): CategoriaServicio | null {
    const mapeo: { [key: string]: CategoriaServicio } = {
      'mantenimiento': CategoriaServicio.MANTENIMIENTO,
      'reparacion': CategoriaServicio.REPARACION,
      'instalacion': CategoriaServicio.INSTALACION
    };
    return mapeo[tipo] || null;
  }

  onMarcaChange(): void {
    this.productoSeleccionado = '';
    this.modeloSeleccionado = '';
  }

  onProductoChange(): void {
    this.modeloSeleccionado = '';
  }

  agendarServicio(): void {
    if (!this.marcaSeleccionada) {
      alert('Por favor selecciona una marca');
      return;
    }
    if (!this.productoSeleccionado) {
      alert('Por favor selecciona un tipo de producto');
      return;
    }
    if (!this.ubicacionSeleccionada) {
      alert('Por favor selecciona tu ubicación');
      return;
    }
    // fechaSeleccionada y horaSeleccionada son opcionales
    // modeloSeleccionado es opcional
    // Aquí puedes agregar la lógica para agendar el servicio
    console.log('Agendando servicio:', {
      servicio: this.servicioSeleccionado,
      marca: this.marcaSeleccionada,
      producto: this.productoSeleccionado,
      modelo: this.modeloSeleccionado,
      ubicacion: this.ubicacionSeleccionada,
      sintomas: this.sintomas,
      fecha: this.fechaSeleccionada,
      hora: this.horaSeleccionada
    });

    // Navegar a la página de técnicos con los datos
    this.router.navigate(['/tecnicos'], {
      queryParams: {
        servicio: this.servicioSeleccionado?.id,
        marca: this.marcaSeleccionada,
        producto: this.productoSeleccionado,
        modelo: this.modeloSeleccionado,
        ubicacion: this.ubicacionSeleccionada,
        sintomas: this.sintomas,
        fecha: this.fechaSeleccionada,
        hora: this.horaSeleccionada
      }
    });
  }

  abrirModalModelo() {
    this.mostrarModalModelo = true;
  }

  cerrarModalModelo() {
    this.mostrarModalModelo = false;
  }

  volverAHome(): void {
    this.router.navigate(['/']);
  }
}
