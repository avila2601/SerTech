import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TecnicoService } from '../../services/tecnico.service';

@Component({
  selector: 'app-ingreso-tecnicos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop" (click)="cerrar()"></div>
    <div class="modal-ingreso" (click)="$event.stopPropagation()">
      <h2>Ingreso de Técnicos</h2>
      <form (ngSubmit)="ingresar()" autocomplete="off">
        <div class="form-group">
          <label for="tecnicoId">ID de Técnico</label>
          <input id="tecnicoId" name="tecnicoId" [(ngModel)]="tecnicoId" required autocomplete="off" />
        </div>
        <div class="form-group">
          <label for="password">Contraseña</label>
          <input id="password" name="password" type="password" [(ngModel)]="password" required autocomplete="off" />
        </div>
        <button class="btn btn-primary btn-ingresar" type="submit">Ingresar</button>
      </form>
      <div *ngIf="errorMsg" class="error-msg">{{ errorMsg }}</div>
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
    h2 {
      margin-bottom: 1.5rem;
      color: #a5b4fc;
      font-size: 1.3rem;
      font-weight: 700;
      text-align: center;
    }
    .form-group {
      margin-bottom: 1.2rem;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    label {
      color: #b0b0b0;
      font-size: 1rem;
      margin-bottom: 0.3rem;
      font-weight: 500;
    }
    input {
      width: 100%;
      padding: 0.7rem 1rem;
      border-radius: 8px;
      border: 1px solid #374151;
      background: rgba(17, 24, 39, 0.8);
      color: #e0e0e0;
      font-size: 1rem;
      margin-bottom: 0.2rem;
      transition: border 0.2s;
    }
    input:focus {
      outline: none;
      border-color: #667eea;
      background: rgba(17, 24, 39, 0.9);
    }
    .btn-ingresar {
      width: 100%;
      margin-top: 0.5rem;
      padding: 0.7rem 0;
      font-size: 1.08rem;
      border-radius: 8px;
      font-weight: 600;
    }
    .error-msg {
      color: #ff6b6b;
      margin-top: 0.7rem;
      text-align: center;
      font-weight: 500;
      font-size: 1rem;
    }
  `]
})
export class IngresoTecnicosComponent {
  tecnicoId: string = '';
  password: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() loginSuccess = new EventEmitter<string>();
  errorMsg: string = '';

  constructor(private router: Router, private tecnicoService: TecnicoService) {}

  ingresar() {
    if (this.tecnicoId && this.password) {
      this.tecnicoService.getTecnicoById(this.tecnicoId).subscribe(tecnico => {
        if (tecnico && tecnico.contraseña === this.password) {
          this.errorMsg = '';
          this.loginSuccess.emit(this.tecnicoId);
          this.cerrar();
          this.router.navigate(['/mis-citas'], { queryParams: { tecnicoId: this.tecnicoId } });
        } else {
          this.errorMsg = 'ID o contraseña incorrectos';
        }
      });
    }
  }

  cerrar() {
    this.close.emit();
  }
}
