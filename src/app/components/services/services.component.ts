import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
  imports: [CommonModule, FormsModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  selectedService: Service | null = null;
  selectedBrand: string = '';
  selectedProduct: string = '';
  selectedModel: string = '';
  showModelModal: boolean = false;
  symptoms: string = '';
  selectedLocation: string = '';
  selectedDate: string = '';
  selectedTime: string = '';
  minDate: string;
  availableHours = [
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

  private availableServices: ServiceCard[] = [
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

  serviceIcon: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private serviceService: ServiceService
  ) {
    // Minimum date is today
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      // Handle data coming from schedule (return)
      if (params['brand']) {
        this.selectedBrand = params['brand'];
        this.selectedProduct = params['product'] || '';
        this.selectedModel = params['model'] || '';
        this.symptoms = params['symptoms'] || '';
        this.selectedLocation = params['location'] || '';
        this.selectedDate = params['date'] || '';
        this.selectedTime = params['time'] || '';

        // If no service selected, select a default one
        if (!this.selectedService) {
          this.serviceService.getServicesByCategory(ServiceCategory.REPAIR).subscribe(services => {
            if (services && services.length > 0) {
              this.selectedService = services[0];
            }
          });
        }
      }

      // Handle selection from home
      const serviceType = params['type'];
      if (serviceType) {
        // Map service type to corresponding category
        const category = this.mapTypeToCategory(serviceType);
        if (category) {
          // Get the first service of that category
          this.serviceService.getServicesByCategory(category).subscribe(services => {
            if (services && services.length > 0) {
              this.selectedService = services[0];
            }
          });
        }
      }
      // Save received icon
      if (params['icon']) {
        this.serviceIcon = params['icon'];
      }
    });
  }

  private mapTypeToCategory(type: string): ServiceCategory | null {
    const mapping: { [key: string]: ServiceCategory } = {
      'maintenance': ServiceCategory.MAINTENANCE,
      'repair': ServiceCategory.REPAIR,
      'installation': ServiceCategory.INSTALLATION
    };
    return mapping[type] || null;
  }

  onBrandChange(): void {
    this.selectedProduct = '';
    this.selectedModel = '';
  }

  onProductChange(): void {
    this.selectedModel = '';
  }

  scheduleService(): void {
    if (!this.selectedBrand) {
      alert('Por favor selecciona una marca');
      return;
    }
    if (!this.selectedProduct) {
      alert('Por favor selecciona un tipo de producto');
      return;
    }
    if (!this.selectedLocation) {
      alert('Por favor selecciona tu ubicación');
      return;
    }
    // selectedDate and selectedTime are optional
    // selectedModel is optional
    // Here you can add the logic to schedule the service
    console.log('Scheduling service:', {
      service: this.selectedService,
      brand: this.selectedBrand,
      product: this.selectedProduct,
      model: this.selectedModel,
      location: this.selectedLocation,
      symptoms: this.symptoms,
      date: this.selectedDate,
      time: this.selectedTime
    });

    // Navigate to technicians page with data (using English route)
    this.router.navigate(['/technicians'], {
      queryParams: {
        service: this.selectedService?.id,
        brand: this.selectedBrand,
        product: this.selectedProduct,
        model: this.selectedModel,
        location: this.selectedLocation,
        symptoms: this.symptoms,
        date: this.selectedDate,
        time: this.selectedTime
      }
    });
  }

  openModelModal() {
    this.showModelModal = true;
  }

  closeModelModal() {
    this.showModelModal = false;
  }

  goBackToHome(): void {
    this.router.navigate(['/']);
  }
}
