import { Component, Input, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { Review } from '../../services/review.service';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-technician-reviews-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" (click)="closeModal()"></div>
    <div class="modal-reviews" (click)="$event.stopPropagation()">
      <h2>Client Reviews</h2>
      <div *ngIf="loading" class="loading">
        <p>Loading reviews...</p>
      </div>
      <div *ngIf="!loading && reviews.length === 0" class="no-reviews">
        <p>No reviews for this technician.</p>
      </div>
      <div *ngFor="let review of reviews" class="review-card">
        <div class="review-header">
          <span class="client">{{ review.clientName }}</span>
          <span class="rating">
            <ng-container *ngFor="let star of getStars(review.rating)">★</ng-container>
            <ng-container *ngFor="let star of getEmptyStars(review.rating)">☆</ng-container>
          </span>
        </div>
        <div class="review-comment">{{ review.comment }}</div>
        <div class="review-date">{{ review.date | date:'longDate' }}</div>
      </div>
      <button class="btn btn-secondary close-btn" (click)="closeModal()">Close</button>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.5);
      z-index: 1000;
    }
    .modal-reviews {
      position: fixed;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      background: #232946;
      color: #fff;
      border-radius: 16px;
      padding: 2rem 1.5rem 1.5rem 1.5rem;
      min-width: 340px;
      max-width: 95vw;
      z-index: 1001;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      max-height: 80vh;
      overflow-y: auto;
    }
    .modal-reviews h2 {
      margin-bottom: 1.2rem;
    }
    .review-card {
      background: rgba(255,255,255,0.05);
      border-radius: 10px;
      margin-bottom: 1.2rem;
      padding: 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .client {
      font-weight: 600;
      color: #a7a9be;
    }
    .rating {
      color: #ffd700;
      font-size: 1.1rem;
    }
    .review-comment {
      margin-bottom: 0.3rem;
      color: #e0e0e0;
    }
    .review-date {
      font-size: 0.9rem;
      color: #b0b0b0;
      text-align: right;
    }
    .close-btn {
      margin-top: 1rem;
      width: 100%;
    }
    .no-reviews, .loading {
      text-align: center;
      color: #b0b0b0;
      margin-bottom: 1rem;
    }
  `]
})
export class TechnicianReviewsModalComponent implements OnInit {
  @Input() technicianId: string = '';
  @Output() close = new EventEmitter<void>(); // Emitted when modal closes
  reviews: Review[] = [];
  loading: boolean = true;

  constructor(private reviewService: ReviewService) {}

  @HostListener('document:keydown.escape', ['$event'])
  onEsc(event: KeyboardEvent) {
    this.closeModal();
  }

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.loading = true;
    this.reviewService.getReviewsByTechnician(this.technicianId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
        this.reviews = [];
        this.loading = false;
      }
    });
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - rating).fill(0);
  }

  closeModal() {
    this.close.emit();
  }
}
