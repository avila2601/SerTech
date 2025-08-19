import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddReviewUseCase } from '../../core/application/use-cases/reviews/add-review.usecase';
import { Review } from '../../core/domain/models/review.model';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent {
  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.closeModal();
    }
  }

  @Input() technicianId: string = '';
  @Input() clientId: string = '';
  @Input() clientName: string = '';
  @Input() appointmentId: string = '';
  @Output() modalClosed = new EventEmitter<void>();
  @Output() reviewSubmitted = new EventEmitter<void>();
  rating: number = 0;
  comment: string = '';
  isSubmitting: boolean = false;

  constructor(private addReviewUseCase: AddReviewUseCase) {}

  submitReview() {
    if (!this.rating || !this.comment.trim()) {
      alert('Por favor, califica y escribe un comentario.');
      return;
    }

    this.isSubmitting = true;

    const newReview: Omit<Review, 'id'> = {
      appointmentId: this.appointmentId,
      technicianId: this.technicianId,
      clientId: this.clientId,
      clientName: this.clientName,
      comment: this.comment,
      rating: this.rating,
      date: new Date().toISOString().split('T')[0]
    };

    this.addReviewUseCase.execute(newReview).subscribe({
      next: () => {
        alert('¡Reseña enviada exitosamente!');
        this.reviewSubmitted.emit();
        this.closeModal();
      },
      error: (error: any) => {
        console.error('Error al enviar reseña:', error);
        alert('No se pudo enviar la reseña. Por favor, intenta de nuevo.');
        this.isSubmitting = false;
      }
    });
  }

  closeModal() {
    this.modalClosed.emit();
  }
}
