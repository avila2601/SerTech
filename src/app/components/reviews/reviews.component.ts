import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResenaService } from '../../services/resena.service';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent {
  @Input() technicianId: string = '';
  @Input() clientId: string = '';
  @Input() clientName: string = '';
  @Output() modalClosed = new EventEmitter<void>();
  @Output() reviewSubmitted = new EventEmitter<void>();
  rating: number = 0;
  comment: string = '';
  submitting: boolean = false;

  constructor(private resenaService: ResenaService) {}

  submitReview() {
    if (!this.rating || !this.comment.trim()) {
      alert('Por favor, califica y escribe un comentario.');
      return;
    }

    this.submitting = true;

    const newReview = {
      tecnicoId: this.technicianId,
      clienteId: this.clientId,
      cliente: this.clientName,
      comentario: this.comment,
      calificacion: this.rating,
      fecha: new Date().toISOString().split('T')[0]
    };

    this.resenaService.agregarResena(newReview).subscribe({
      next: () => {
        alert('¡Reseña enviada exitosamente!');
        this.reviewSubmitted.emit();
        this.closeModal();
      },
      error: (error: any) => {
        console.error('Error al enviar reseña:', error);
        alert('No se pudo enviar la reseña. Por favor, intenta de nuevo.');
        this.submitting = false;
      }
    });
  }

  closeModal() {
    this.modalClosed.emit();
  }
}
