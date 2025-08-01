import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent {
  @Input() technicianId: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() reviewSubmitted = new EventEmitter<void>();

  rating = 0;
  comment = '';
  isSubmitting = false;

  constructor(private reviewService: ReviewService) {}

  closeModal(): void {
    this.close.emit();
  }

  submitReview(): void {
    if (!this.technicianId) return;
    this.isSubmitting = true;
    this.reviewService
      .addReview({
        technicianId: this.technicianId,
        clientName: '',
        comment: this.comment,
        rating: this.rating,
        date: new Date().toISOString()
      })
      .subscribe(
        () => {
          this.reviewSubmitted.emit();
          this.isSubmitting = false;
        },
        () => {
          this.isSubmitting = false;
        }
      );
  }
}
