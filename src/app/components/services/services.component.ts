import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ServiceService } from '../../services/service.service';
import { Service, ServiceCategory } from '../../models';

interface ServiceCard {
  type: string;
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  selectedService: Service | null = null;
  brand: string = '';
  product: string = '';
  model: string = '';
  showModelModal: boolean = false;
  symptoms: string = '';
  location: string = '';
  date: string = '';
  time: string = '';
  minDate: string;
  availableTimes = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];
  locations: string[] = [
    'Cerrillos', 'Cerro Navia', 'Conchalí', 'El Bosque', 'Estación Central',
    'Huechuraba', 'Independencia', 'La Cisterna', 'La Florida', 'La Granja',
    'La Pintana', 'La Reina', 'Las Condes', 'Lo Barnechea', 'Lo Espejo',
    'Lo Prado', 'Macul', 'Maipú', 'Ñuñoa', 'Pedro Aguirre Cerda',
    'Peñalolén', 'Providencia', 'Pudahuel', 'Puente Alto', 'Quilicura',
    'Quinta Normal', 'Recoleta', 'Renca', 'San Joaquín', 'San Miguel',
    'San Ramón', 'Santiago (Centro)', 'Vitacura', 'El Monte', 'Padre Hurtado'
  ];

  brands: string[] = [
    'Samsung', 'LG', 'Whirlpool', 'Mabe', 'Electrolux',
    'Panasonic', 'Sony', 'Philips', 'Bosch', 'Frigidaire',
    'GE', 'Maytag', 'KitchenAid', 'Kenmore', 'Amana'
  ];

  products: string[] = [
    'Refrigerador', 'Lavadora', 'Secadora', 'Microondas', 'Horno',
    'Lavavajillas', 'Cafetera', 'Licuadora', 'Batidora', 'Tostadora',
    'Aspiradora', 'Ventilador', 'Aire acondicionado', 'Televisor', 'Estéreo'
  ];

  models: string[] = [
    'RF-2023-A', 'LG-WM-4500', 'WH-SD-789', 'MB-FR-321', 'EL-MW-567',
    'PN-TV-890', 'SN-BT-234', 'PH-AC-456', 'BS-DW-789', 'FG-RF-123',
    'GE-LV-567', 'MY-DR-890', 'KA-MX-234', 'KM-WM-456', 'AM-TV-789'
  ];

  private availableServiceCards: ServiceCard[] = [
    {
      type: 'maintenance',
      title: 'Mantenimiento',
      description: 'Mantenimiento preventivo de tu equipo',
      icon: '🔧'
    },
    {
      type: 'repair',
      title: 'Reparación',
      description: 'Tu equipo tiene un daño? lo reparamos',
      icon: '🔧'
    },
    {
      type: 'installation',
      title: 'Instalación',
      description: 'Instalación y configuración',
      icon: '⚙️'
    }
  ];

  iconoServicio: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private serviceService: ServiceService
  ) {
    // Fecha mínima es hoy
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['brand']) {
        this.brand = params['brand'];
        this.product = params['product'] || '';
        this.model = params['model'] || '';
        this.symptoms = params['symptoms'] || '';
        this.location = params['location'] || '';
        this.date = params['date'] || '';
        this.time = params['time'] || '';

        // Si no hay servicio seleccionado, seleccionar uno por defecto
        if (!this.selectedService) {
          this.serviceService.getServicesByCategory(ServiceCategory.REPAIR).subscribe(services => {
            if (services && services.length > 0) {
              this.selectedService = services[0];
            }
          });
        }
      }

      // Manejar selección desde home
      const serviceType = params['type'];
      if (serviceType) {
        // Map service type to corresponding category
        const category = this.mapTypeToCategory(serviceType);
        if (category) {
          this.serviceService.getServicesByCategory(category).subscribe(services => {
            if (services && services.length > 0) {
              this.selectedService = services[0];
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

  private mapTypeToCategory(type: string): ServiceCategory | null {
    const mapping: Record<string, ServiceCategory> = {
      'maintenance': ServiceCategory.MAINTENANCE,
      'repair': ServiceCategory.REPAIR,
      'installation': ServiceCategory.INSTALLATION
    };
    return mapping[type] || null;
  }

  onBrandChange(): void {
    this.product = '';
    this.model = '';
  }

  onProductChange(): void {
    this.model = '';
  }

  scheduleService(): void {
    if (!this.brand) {
      alert('Please select a brand');
      return;
    }
    if (!this.product) {
      alert('Please select a product type');
      return;
    }
    if (!this.location) {
      alert('Please select your location');
      return;
    }
    // fechaSeleccionada y horaSeleccionada son opcionales
    // modeloSeleccionado es opcional
    // Aquí puedes agregar la lógica para agendar el servicio
    console.log('Scheduling service:', {
      service: this.selectedService,
      brand: this.brand,
      product: this.product,
      model: this.model,
      location: this.location,
      symptoms: this.symptoms,
      date: this.date,
      time: this.time
    });

    // Navegar a la página de técnicos con los datos
    this.router.navigate(['/technicians'], {
      queryParams: {
        serviceId: this.selectedService?.id,
        brand: this.brand,
        product: this.product,
        model: this.model,
        location: this.location,
        symptoms: this.symptoms,
        date: this.date,
        time: this.time
      }
    });
  }

  abrirModalModelo() {
    this.showModelModal = true;
  }

  cerrarModalModelo() {
    this.showModelModal = false;
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
