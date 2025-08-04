import { Component, EventEmitter, Input, Output, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../services/review.service';
import { TechnicianService } from '../../services/technician.service';

@Component({
  selector: 'app-technician-reviews-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" (click)="onClose()"></div>
    <div class="modal-ingreso reviews-modal" (click)="$event.stopPropagation()">
      <h2>Mis Reseñas</h2>

      <div *ngIf="technician" class="technician-info">
        <h3>{{technician.name}}</h3>
        <p>{{technician.specialty}}</p>
        <div class="rating">
          <span class="stars">
            <span *ngFor="let star of getStars(technician.rating)" [innerHTML]="star"></span>
          </span>
          <span class="rating-value">({{technician.rating}}/5)</span>
        </div>
      </div>

      <div class="reviews-section">
        <h4>Reseñas de Clientes</h4>
        <div *ngIf="reviews.length === 0" class="no-reviews">
          No tienes reseñas aún.
        </div>

        <div *ngFor="let review of reviews" class="review-item">
          <div class="review-header">
            <strong>{{review.clientName}}</strong>
            <span class="review-date">{{formatDate(review.date)}}</span>
          </div>
          <div class="review-rating">
            <span *ngFor="let star of getStars(review.rating)" [innerHTML]="star"></span>
            <span class="rating-value">({{review.rating}}/5)</span>
          </div>
          <p class="review-comment">{{review.comment}}</p>
        </div>
      </div>

      <button (click)="onClose()" class="btn btn-primary btn-ingresar">Cerrar</button>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.5);
      z-index: 1000;
    }
    .modal-ingreso {
      position: fixed;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      background: #232946;
      color: #fff;
      border-radius: 16px;
      padding: 2rem 2.5rem 1.5rem 2.5rem;
      min-width: 340px;
      max-width: 95vw;
      z-index: 1001;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      max-height: 80vh;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .reviews-modal {
      max-width: 600px;
      min-width: 500px;
    }
    h2 {
      margin-bottom: 1.5rem;
      color: #a5b4fc;
      font-size: 1.3rem;
      font-weight: 700;
      text-align: center;
    }
    .technician-info {
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: rgba(17, 24, 39, 0.5);
      border-radius: 12px;
      width: 100%;
      text-align: center;
    }
    .technician-info h3 {
      margin: 0 0 0.5rem 0;
      color: #a5b4fc;
      font-size: 1.2rem;
    }
    .technician-info p {
      margin: 0 0 0.5rem 0;
      color: #b0b0b0;
    }
    .rating {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
    }
    .stars {
      color: #ffd700;
      font-size: 1.2rem;
    }
    .rating-value {
      color: #b0b0b0;
      font-size: 0.9rem;
    }
    .reviews-section {
      width: 100%;
      margin-bottom: 1rem;
    }
    .reviews-section h4 {
      margin: 0 0 1rem 0;
      color: #a5b4fc;
      font-size: 1.1rem;
      text-align: center;
    }
    .no-reviews {
      text-align: center;
      color: #b0b0b0;
      padding: 2rem;
      font-style: italic;
    }
    .review-item {
      border: 1px solid #374151;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1rem;
      background: rgba(17, 24, 39, 0.3);
    }
    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .review-header strong {
      color: #a5b4fc;
    }
    .review-date {
      color: #b0b0b0;
      font-size: 0.9rem;
    }
    .review-rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }
    .review-rating .stars {
      font-size: 1rem;
    }
    .review-comment {
      margin: 0;
      color: #e0e0e0;
      line-height: 1.5;
    }
    .btn-ingresar {
      width: 100%;
      margin-top: 0.5rem;
      padding: 0.7rem 0;
      font-size: 1.08rem;
      border-radius: 8px;
      font-weight: 600;
      background: #667eea;
      color: white;
      border: none;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-ingresar:hover {
      background: #5a6fd8;
    }
  `]
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
    this.loadTechnicianData();
    this.loadReviews();
  }

  @HostListener('document:keydown.escape')
  onEscapePress() {
    this.onClose();
  }

  loadTechnicianData() {
    this.technicianService.getTechnicianById(this.technicianId).subscribe(technician => {
      this.technician = technician;
    });
  }

  loadReviews() {
    this.reviewService.getReviewsByTechnician(this.technicianId).subscribe(reviews => {
      this.reviews = reviews;
    });
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
