import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { TechnicianService } from '../../services/technician.service';
import { Technician } from '../../models';
import { TecnicosResenasModalComponent } from './tecnicos-resenas-modal.component';

@Component({
  selector: 'app-tecnicos',
  standalone: true,
  imports: [CommonModule, TecnicosResenasModalComponent],
  templateUrl: './tecnicos.component.html',
  styleUrls: ['./tecnicos.component.scss']
})
export class TecnicosComponent implements OnInit {
  technicians: Technician[] = [];
  showReviewsModal: boolean = false;
  modalTechnicianId: string = '';

  constructor(
    private technicianService: TechnicianService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadTechnicians();
  }

  loadTechnicians(): void {
    this.technicianService.getTechnicians().subscribe(technicians => {
      this.technicians = technicians;
    });
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0);
  }

  selectTechnician(technician: Technician): void {
    this.route.queryParams.subscribe(params => {
      const preservedParams: any = {
        tecnicoId: technician.id
      };

      // Preserve all form parameters
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

      this.router.navigate(['/clientes'], {
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

      this.router.navigate(['/servicios'], {
        queryParams: preservedParams
      });
    });
  }

  openReviewsModal(technicianId: string): void {
    this.modalTechnicianId = technicianId;
    this.showReviewsModal = true;
  }

  closeReviewsModal(): void {
    this.showReviewsModal = false;
    this.modalTechnicianId = '';
  }

  getRandomAvatar(id: string): string {
    // Use pravatar.cc to get a random but consistent image per technician
    const num = (parseInt(id, 10) % 70) + 1;
    return `https://i.pravatar.cc/150?img=${num}`;
  }
}
