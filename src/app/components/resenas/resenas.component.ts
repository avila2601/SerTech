import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResenaService } from '../../services/resena.service';

@Component({
  selector: 'app-resenas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop" (click)="cerrar()"></div>
    <div class="modal-resenas" (click)="$event.stopPropagation()">
      <h2>Evaluar servicio</h2>
      <form (ngSubmit)="enviarResena()">
        <div class="estrellas">
          <span *ngFor="let star of [1,2,3,4,5]" (click)="calificacion = star" [class.selected]="star <= calificacion">★</span>
        </div>
        <div class="form-group">
          <label for="comentario">Comentario</label>
          <textarea id="comentario" [(ngModel)]="comentario" name="comentario" rows="3" required></textarea>
        </div>
        <button class="btn btn-primary" type="submit" [disabled]="enviando">
          {{ enviando ? 'Enviando...' : 'Enviar' }}
        </button>
      </form>
      <button class="btn btn-secondary cerrar-btn" (click)="cerrar()">Cerrar</button>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.5);
      z-index: 1000;
    }
    .modal-resenas {
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
    h2 {
      margin-bottom: 1.2rem;
      text-align: center;
    }
    .estrellas {
      display: flex;
      justify-content: center;
      margin-bottom: 1rem;
      font-size: 2rem;
      color: #6c757d;
      cursor: pointer;
    }
    .estrellas span {
      margin: 0 0.2rem;
      transition: color 0.2s;
    }
    .estrellas span.selected {
      color: #ffd700;
      text-shadow: 0 2px 8px #ffd70099;
    }
    .form-group {
      margin-bottom: 1.2rem;
    }
    textarea {
      width: 100%;
      border-radius: 8px;
      border: 1px solid #374151;
      background: rgba(17, 24, 39, 0.8);
      color: #e0e0e0;
      font-size: 1rem;
      padding: 0.7rem 1rem;
      resize: vertical;
    }
    .btn {
      width: 100%;
      margin-top: 0.5rem;
      padding: 0.7rem 0;
      font-size: 1.08rem;
      border-radius: 8px;
      font-weight: 600;
    }
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .cerrar-btn {
      background: #6c757d;
      color: #fff;
      margin-top: 1rem;
    }
  `]
})
export class ResenasComponent {
  @Input() tecnicoId: string = '';
  @Input() clienteId: string = '';
  @Input() cliente: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() resenaEnviada = new EventEmitter<void>();
  calificacion: number = 0;
  comentario: string = '';
  enviando: boolean = false;

  constructor(private resenaService: ResenaService) {}

  enviarResena() {
    if (!this.calificacion || !this.comentario.trim()) {
      alert('Por favor, califica y escribe un comentario.');
      return;
    }

    this.enviando = true;

    const nuevaResena = {
      tecnicoId: this.tecnicoId,
      clienteId: this.clienteId,
      cliente: this.cliente,
      comentario: this.comentario,
      calificacion: this.calificacion,
      fecha: new Date().toISOString().split('T')[0]
    };

    this.resenaService.agregarResena(nuevaResena).subscribe({
      next: () => {
        alert('¡Reseña enviada exitosamente!');
        this.resenaEnviada.emit();
        this.cerrar();
      },
      error: (error) => {
        console.error('Error al enviar reseña:', error);
        alert('No se pudo enviar la reseña. Por favor, intenta de nuevo.');
        this.enviando = false;
      }
    });
  }

  cerrar() {
    this.close.emit();
  }
}
