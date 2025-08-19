import { Component, EventEmitter, Input, Output, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { Technician } from '../../core/domain/models/technician.model';
import { Review } from '../../core/domain/models/review.model';
import { GetTechnicianByIdUseCase } from '../../core/application/use-cases/technicians/get-technician-by-id.usecase';
import { GetReviewsByTechnicianIdUseCase } from '../../core/application/use-cases/reviews/get-reviews-by-technician-id.usecase';

@Component({
  selector: 'app-technician-reviews-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './technician-reviews-modal.component.html',
  styleUrls: ['./technician-reviews-modal.component.scss']
})
export class TechnicianReviewsModalComponent implements OnInit {
  @Input() technicianId: string = '';
  @Output() close = new EventEmitter<void>();

  technician: Technician | undefined;
  reviews: Review[] = [];
  averageRating: number = 0;

  constructor(
    private getTechnicianById: GetTechnicianByIdUseCase,
    private getReviewsById: GetReviewsByTechnicianIdUseCase
  ) {}

  ngOnInit() {
    if (!this.technicianId) return;

    const technician$ = this.getTechnicianById.execute(this.technicianId);
    const reviews$ = this.getReviewsById.execute(this.technicianId);

    forkJoin({
      technician: technician$,
      reviews: reviews$
    }).subscribe(({ technician, reviews }) => {
      this.technician = technician;
      this.reviews = reviews;

      if (reviews && reviews.length > 0) {
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        this.averageRating = parseFloat((totalRating / reviews.length).toFixed(1));
      } else {
        this.averageRating = 0;
      }
    });
  }

  @HostListener('document:keydown.escape')
  onEscapePress() {
    this.onClose();
  }

  getStars(rating: number): string[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }

    if (hasHalfStar && stars.length < 5) {
      // This logic can be improved, but for now keeps original intent
      stars.push('☆');
    }

    while(stars.length < 5) {
      stars.push('☆');
    }

    return stars;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  }

  onClose() {
    this.close.emit();
  }
}
