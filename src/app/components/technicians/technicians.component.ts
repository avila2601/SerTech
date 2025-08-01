import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { TechnicianService } from '../../services/technician.service';
import { Technician } from '../../models';
import { TechnicianReviewsModalComponent } from './technician-reviews-modal.component';

@Component({
  selector: 'app-technicians',
  standalone: true,
imports: [CommonModule, RouterModule, TechnicianReviewsModalComponent],
  templateUrl: './technicians.component.html',
  styleUrls: ['./technicians.component.scss']
})
export class TechniciansComponent implements OnInit {
  technicians: Technician[] = [];
  showReviewModal: boolean = false;
  technicianIdModal: string = '';

  constructor(
    private technicianService: TechnicianService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadTechnicians();
  }

  loadTechnicians(): void {
    this.technicianService.getTechnicians().subscribe((technicians: Technician[]) => {
      this.technicians = technicians;
    });
  }

  getStars(calificacion: number): number[] {
    return Array(Math.floor(calificacion)).fill(0);
  }

  getEmptyStars(calificacion: number): number[] {
    return Array(5 - Math.floor(calificacion)).fill(0);
  }

  selectTechnician(technician: Technician): void {
    this.route.queryParams.subscribe(params => {
      const preservedParams: any = {
        technicianId: technician.id
      };

      // Preservar parámetros en inglés (primario)
      if (params['serviceId']) preservedParams.serviceId = params['serviceId'];
      if (params['brand']) preservedParams.brand = params['brand'];
      if (params['product']) preservedParams.product = params['product'];
      if (params['model']) preservedParams.model = params['model'];
      if (params['location']) preservedParams.location = params['location'];
      if (params['symptoms']) preservedParams.symptoms = params['symptoms'];
      if (params['date']) preservedParams.date = params['date'];
      if (params['time']) preservedParams.time = params['time'];

      // Fallback: si vienen en español, convertir a inglés
      if (params['servicio'] && !params['serviceId']) {
        preservedParams.serviceId = params['servicio'];
      }
      if (params['marca'] && !params['brand']) {
        preservedParams.brand = params['marca'];
      }
      if (params['producto'] && !params['product']) {
        preservedParams.product = params['producto'];
      }
      if (params['modelo'] && !params['model']) {
        preservedParams.model = params['modelo'];
      }
      if (params['ubicacion'] && !params['location']) {
        preservedParams.location = params['ubicacion'];
      }
      if (params['sintomas'] && !params['symptoms']) {
        preservedParams.symptoms = params['sintomas'];
      }
      if (params['fecha'] && !params['date']) {
        preservedParams.date = params['fecha'];
      }
      if (params['hora'] && !params['time']) {
        preservedParams.time = params['hora'];
      }

      this.router.navigate(['/clients'], {
        queryParams: preservedParams
      });
    });
  }

  goBackToServices(): void {
    this.route.queryParams.subscribe(params => {
      const preservedParams: any = {};

      // Preservar parámetros en inglés (primario)
      if (params['serviceId']) preservedParams.serviceId = params['serviceId'];
      if (params['brand']) preservedParams.brand = params['brand'];
      if (params['product']) preservedParams.product = params['product'];
      if (params['model']) preservedParams.model = params['model'];
      if (params['location']) preservedParams.location = params['location'];
      if (params['symptoms']) preservedParams.symptoms = params['symptoms'];
      if (params['date']) preservedParams.date = params['date'];
      if (params['time']) preservedParams.time = params['time'];

      // Fallback: si vienen en español, convertir a inglés
      if (params['servicio'] && !params['serviceId']) {
        preservedParams.serviceId = params['servicio'];
      }
      if (params['marca'] && !params['brand']) {
        preservedParams.brand = params['marca'];
      }
      if (params['producto'] && !params['product']) {
        preservedParams.product = params['producto'];
      }
      if (params['modelo'] && !params['model']) {
        preservedParams.model = params['modelo'];
      }
      if (params['ubicacion'] && !params['location']) {
        preservedParams.location = params['ubicacion'];
      }
      if (params['sintomas'] && !params['symptoms']) {
        preservedParams.symptoms = params['sintomas'];
      }
      if (params['fecha'] && !params['date']) {
        preservedParams.date = params['fecha'];
      }
      if (params['hora'] && !params['time']) {
        preservedParams.time = params['hora'];
      }

      this.router.navigate(['/services'], {
        queryParams: preservedParams
      });
    });
  }

  openReviewModal(technicianId: string): void {
    this.technicianIdModal = technicianId;
    this.showReviewModal = true;
  }

  closeReviewModal(): void {
    this.showReviewModal = false;
    this.technicianIdModal = '';
  }

  getRandomAvatar(id: string): string {
    // Usamos pravatar.cc para obtener una imagen aleatoria pero consistente por técnico
    const num = (parseInt(id, 10) % 70) + 1;
    return `https://i.pravatar.cc/150?img=${num}`;
  }
}
