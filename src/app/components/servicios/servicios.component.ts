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
  referenciaSeleccionada: string = '';

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

  referencias: string[] = [
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
    },
    {
      tipo: 'diagnostico',
      titulo: 'Diagnóstico',
      descripcion: 'Diagnóstico de problemas',
      icono: '🔍'
    }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private servicioService: ServicioService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
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
    });
  }

  private mapearTipoACategoria(tipo: string): CategoriaServicio | null {
    const mapeo: { [key: string]: CategoriaServicio } = {
      'mantenimiento': CategoriaServicio.MANTENIMIENTO,
      'reparacion': CategoriaServicio.REPARACION,
      'instalacion': CategoriaServicio.INSTALACION,
      'diagnostico': CategoriaServicio.DIAGNOSTICO
    };
    return mapeo[tipo] || null;
  }

  onMarcaChange(): void {
    this.productoSeleccionado = '';
    this.referenciaSeleccionada = '';
  }

  onProductoChange(): void {
    this.referenciaSeleccionada = '';
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
    if (!this.referenciaSeleccionada) {
      alert('Por favor selecciona una referencia');
      return;
    }

    // Aquí puedes agregar la lógica para agendar el servicio
    console.log('Agendando servicio:', {
      servicio: this.servicioSeleccionado,
      marca: this.marcaSeleccionada,
      producto: this.productoSeleccionado,
      referencia: this.referenciaSeleccionada
    });

    // Navegar a la página de agendar con los datos
    this.router.navigate(['/agendar'], {
      queryParams: {
        servicio: this.servicioSeleccionado?.id,
        marca: this.marcaSeleccionada,
        producto: this.productoSeleccionado,
        referencia: this.referenciaSeleccionada
      }
    });
  }

  volverAHome(): void {
    this.router.navigate(['/']);
  }
}
