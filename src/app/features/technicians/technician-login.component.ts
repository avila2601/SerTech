import { Component, EventEmitter, Output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TechnicianService } from '../../services/technician.service';

@Component({
  selector: 'app-technician-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop" (click)="onClose()"></div>
    <div class="modal-ingreso" (click)="$event.stopPropagation()">
      <form (ngSubmit)="onLogin()" #loginForm="ngForm" autocomplete="off">
        <div class="form-group">
          <label for="technicianId">ID de Técnico</label>
          <input
            id="technicianId"
            [(ngModel)]="technicianId"
            name="technicianId"
            type="text"
            required
            autocomplete="off"
            placeholder="Ingresa tu ID de técnico">
        </div>

        <div class="form-group">
          <label for="password">Ingresa tu contraseña</label>
          <input
            type="password"
            id="password"
            [(ngModel)]="password"
            name="password"
            required
            autocomplete="off"
            placeholder="Contraseña">
        </div>

        <button type="submit" [disabled]="!loginForm.form.valid" class="btn btn-primary btn-ingresar">
          Ingresar
        </button>
      </form>
      <div *ngIf="errorMessage" class="error-msg">{{ errorMessage }}</div>
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
      background: #667eea;
      color: white;
      border: none;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-ingresar:hover:not(:disabled) {
      background: #5a6fd8;
    }
    .btn-ingresar:disabled {
      background: #4a5568;
      cursor: not-allowed;
      opacity: 0.6;
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
export class TechnicianLoginComponent {
  @Output() close = new EventEmitter<void>();
  @Output() loginSuccess = new EventEmitter<string>();

  technicianId: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private technicianService: TechnicianService) {}

  @HostListener('document:keydown.escape')
  onEscapePress() {
    this.onClose();
  }

  onLogin() {
    if (!this.technicianId || !this.password) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    // Buscar el técnico por ID
    this.technicianService.getTechnicians().subscribe(technicians => {
      const technician = technicians.find(t => t.id === this.technicianId);
      if (technician && technician.password === this.password) {
        this.loginSuccess.emit(this.technicianId);
        this.onClose();
      } else {
        this.errorMessage = 'ID de técnico o contraseña incorrectos';
      }
    });
  }

  onClose() {
    this.close.emit();
  }
}
