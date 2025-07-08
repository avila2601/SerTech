import { Component, Input, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResenaService } from '../../services/resena.service';

@Component({
  selector: 'app-tecnicos-resenas-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" (click)="cerrar()"></div>
    <div class="modal-resenas" (click)="$event.stopPropagation()">
      <h2>Reseñas de clientes</h2>
      <div *ngIf="cargando" class="cargando">
        <p>Cargando reseñas...</p>
      </div>
      <div *ngIf="!cargando && resenas.length === 0" class="sin-resenas">
        <p>No hay reseñas para este técnico.</p>
      </div>
      <div *ngFor="let resena of resenas" class="resena-card">
        <div class="resena-header">
          <span class="cliente">{{ resena.cliente }}</span>
          <span class="calificacion">
            <ng-container *ngFor="let star of getStars(resena.calificacion)">★</ng-container>
            <ng-container *ngFor="let star of getEmptyStars(resena.calificacion)">☆</ng-container>
          </span>
        </div>
        <div class="resena-comentario">{{ resena.comentario }}</div>
        <div class="resena-fecha">{{ resena.fecha | date:'longDate' }}</div>
      </div>
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
    .modal-resenas h2 {
      margin-bottom: 1.2rem;
    }
    .resena-card {
      background: rgba(255,255,255,0.05);
      border-radius: 10px;
      margin-bottom: 1.2rem;
      padding: 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .resena-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .cliente {
      font-weight: 600;
      color: #a7a9be;
    }
    .calificacion {
      color: #ffd700;
      font-size: 1.1rem;
    }
    .resena-comentario {
      margin-bottom: 0.3rem;
      color: #e0e0e0;
    }
    .resena-fecha {
      font-size: 0.9rem;
      color: #b0b0b0;
      text-align: right;
    }
    .cerrar-btn {
      margin-top: 1rem;
      width: 100%;
    }
    .sin-resenas, .cargando {
      text-align: center;
      color: #b0b0b0;
      margin-bottom: 1rem;
    }
  `]
})
export class TecnicosResenasModalComponent implements OnInit {
  @Input() tecnicoId: string = '';
  @Output() close = new EventEmitter<void>();
  resenas: any[] = [];
  cargando: boolean = true;

  constructor(private resenaService: ResenaService) {}

  @HostListener('document:keydown.escape', ['$event'])
  onEsc(event: KeyboardEvent) {
    this.cerrar();
  }

  ngOnInit(): void {
    this.cargarResenas();
  }

  cargarResenas(): void {
    this.cargando = true;
    this.resenaService.getResenasPorTecnico(this.tecnicoId).subscribe({
      next: (resenas) => {
        this.resenas = resenas;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar reseñas:', error);
        this.resenas = [];
        this.cargando = false;
      }
    });
  }

  getStars(calificacion: number): number[] {
    return Array(calificacion).fill(0);
  }

  getEmptyStars(calificacion: number): number[] {
    return Array(5 - calificacion).fill(0);
  }

  cerrar() {
    this.close.emit();
  }
}
