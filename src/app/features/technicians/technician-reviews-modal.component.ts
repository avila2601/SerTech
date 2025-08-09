import { Component, EventEmitter, Input, Output, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { ReviewService } from '../../services/review.service';
import { TechnicianService } from '../../services/technician.service';

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

  technician: any = null;
  reviews: any[] = [];

  constructor(
    private reviewService: ReviewService,
    private technicianService: TechnicianService
  ) {}

  ngOnInit() {
    forkJoin({
      technician: this.technicianService.getTechnicianById(this.technicianId),
      reviews: this.reviewService.getReviewsByTechnician(this.technicianId)
    }).subscribe(({ technician, reviews }) => {
      this.technician = technician;
      this.reviews = reviews;

      if (this.technician && this.reviews.length > 0) {
        const totalRating = this.reviews.reduce((acc, review) => acc + review.rating, 0);
        const averageRating = totalRating / this.reviews.length;
        this.technician.rating = parseFloat(averageRating.toFixed(1));
      } else if (this.technician) {
        this.technician.rating = 0;
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

    if (hasHalfStar) {
      stars.push('☆');
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
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
