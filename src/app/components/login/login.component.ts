import { Component, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop" (click)="closeModal()"></div>
    <div class="modal-ingreso" (click)="$event.stopPropagation()">
      <h2>Iniciar Sesión</h2>
      <form (ngSubmit)="login()" autocomplete="off">
        <div class="form-group">
          <label for="email">Ingresa tu e-mail</label>
          <input id="email" name="email" type="email" [(ngModel)]="email" required autocomplete="off" />
        </div>
        <button class="btn btn-primary btn-ingresar" type="submit">Ingresar</button>
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
export class LoginComponent {
  email: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() loginSuccess = new EventEmitter<void>();
  errorMessage: string = '';

  constructor(private router: Router, private clientService: ClientService) {}

  @HostListener('document:keydown.escape')
  onEscapePress() {
    this.closeModal();
  }

  login() {
    if (!this.email) {
      this.errorMessage = 'Por favor, ingresa tu e-mail.';
      return;
    }

    // Validar formato de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Por favor, ingresa un e-mail válido.';
      return;
    }

    this.clientService.getClients().subscribe((clients: any[]) => {
      const client = clients.find(c => c.email === this.email);
      if (client) {
        // Guardar el clienteId como cliente logueado y limpiar emailLogin
        localStorage.setItem('clienteLogueado', client.id);
        localStorage.removeItem('emailLogin');
      } else {
        // Si el email no existe, guardar el email en emailLogin y limpiar clienteLogueado
        localStorage.setItem('emailLogin', this.email);
        localStorage.removeItem('clienteLogueado');
      }

      this.errorMessage = '';
      this.loginSuccess.emit();
      this.closeModal();
      // Siempre redirigir a inicio
      this.router.navigate(['/']);
    });
  }

  closeModal() {
    this.close.emit();
  }
}
