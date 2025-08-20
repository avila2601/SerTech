import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Technician } from '../../core/domain/models/technician.model';
import { GetAllTechniciansUseCase, SelectTechnicianUseCase } from '../../core/application/use-cases/technicians';
import { TechnicianSelectionParams } from '../../core/application/use-cases/technicians/select-technician.usecase';
import { TechnicianReviewsModalComponent } from './technician-reviews-modal.component';

@Component({
  selector: 'app-technicians',
  standalone: true,
  imports: [CommonModule, TechnicianReviewsModalComponent],
  templateUrl: './technicians.component.html',
  styleUrls: ['./technicians.component.scss']
})
export class TechniciansComponent implements OnInit {
  technicians$!: Observable<Technician[]>;
  showReviewsModal: boolean = false;
  modalTechnicianId: string = '';

  private getAllTechniciansUseCase = inject(GetAllTechniciansUseCase);
  private selectTechnicianUseCase = inject(SelectTechnicianUseCase);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.technicians$ = this.getAllTechniciansUseCase.execute();
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0);
  }

  selectTechnician(technician: Technician): void {
    this.route.queryParams.subscribe(params => {
      const selectionParams: TechnicianSelectionParams = {
        technicianId: technician.id,
        service: params['service'],
        brand: params['brand'],
        product: params['product'],
        model: params['model'],
        location: params['location'],
        symptoms: params['symptoms'],
        date: params['date'],
        time: params['time']
      };

      this.selectTechnicianUseCase.execute(selectionParams).subscribe({
        next: (result) => {
          this.router.navigate([result.route], {
            queryParams: result.params
          });
        },
        error: (error) => {
          console.error('Error selecting technician:', error);
        }
      });
    });
  }

  goBackToServices(): void {
    this.route.queryParams.subscribe(params => {
      const preservedParams: any = {};
      if (params['service']) preservedParams.service = params['service'];
      if (params['brand']) preservedParams.brand = params['brand'];
      if (params['product']) preservedParams.product = params['product'];
      if (params['model']) preservedParams.model = params['model'];
      if (params['location']) preservedParams.location = params['location'];
      if (params['symptoms']) preservedParams.symptoms = params['symptoms'];
      if (params['date']) preservedParams.date = params['date'];
      if (params['time']) preservedParams.time = params['time'];

      this.router.navigate(['/services'], {
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
    const num = (parseInt(id, 10) % 70) + 1;
    return `https://i.pravatar.cc/150?img=${num}`;
  }
}
