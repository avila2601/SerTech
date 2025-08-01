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

      // Preservar todos los parámetros del formulario
      if (params['servicio']) {
        preservedParams.servicio = params['servicio'];
        preservedParams.servicioId = params['servicio'];
      }
      if (params['marca']) preservedParams.marca = params['marca'];
      if (params['producto']) preservedParams.producto = params['producto'];
      if (params['modelo']) preservedParams.modelo = params['modelo'];
      if (params['ubicacion']) preservedParams.ubicacion = params['ubicacion'];
      if (params['sintomas']) preservedParams.sintomas = params['sintomas'];
      if (params['fecha']) preservedParams.fecha = params['fecha'];
      if (params['hora']) preservedParams.hora = params['hora'];

      this.router.navigate(['/clients'], {
        queryParams: preservedParams
      });
    });
  }

  goBackToServices(): void {
    this.route.queryParams.subscribe(params => {
      const preservedParams: any = {};
      if (params['servicio']) preservedParams.servicio = params['servicio'];
      if (params['marca']) preservedParams.marca = params['marca'];
      if (params['producto']) preservedParams.producto = params['producto'];
      if (params['modelo']) preservedParams.modelo = params['modelo'];
      if (params['ubicacion']) preservedParams.ubicacion = params['ubicacion'];
      if (params['sintomas']) preservedParams.sintomas = params['sintomas'];
      if (params['fecha']) preservedParams.fecha = params['fecha'];
      if (params['hora']) preservedParams.hora = params['hora'];

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
