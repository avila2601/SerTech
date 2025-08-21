import { Component, Output, EventEmitter, HostListener, ViewChild, ElementRef, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AuthenticateClientUseCase,
  HandleLoginSuccessUseCase
} from '../../core/application/use-cases/clients';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit {
  email: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() loginSuccess = new EventEmitter<void>();
  @ViewChild('emailInput') emailInput!: ElementRef<HTMLInputElement>;
  errorMessage: string = '';

  // Use Cases
  private readonly router = inject(Router);
  private readonly authenticateClientUseCase = inject(AuthenticateClientUseCase);
  private readonly handleLoginSuccessUseCase = inject(HandleLoginSuccessUseCase);

  ngAfterViewInit() {
    // Usar setTimeout para asegurar que el DOM esté completamente renderizado
    setTimeout(() => {
      this.emailInput.nativeElement.focus();
    }, 100);
  }

  @HostListener('document:keydown.escape')
  onEscapePress() {
    this.closeModal();
  }

  login() {
    this.errorMessage = '';

    this.authenticateClientUseCase.execute({ email: this.email }).subscribe({
      next: (result) => {
        if (result.success) {
          this.handleLoginSuccessUseCase.execute({
            clientFound: result.clientFound,
            clientId: result.clientId,
            redirectToHome: true
          }).subscribe({
            next: () => {
              this.loginSuccess.emit();
              this.closeModal();
            },
            error: (error) => {
              console.error('Error handling login success:', error);
              // Still emit success and close modal even if navigation fails
              this.loginSuccess.emit();
              this.closeModal();
            }
          });
        } else {
          this.errorMessage = result.message;
        }
      },
      error: (error) => {
        console.error('Error during authentication:', error);
        this.errorMessage = 'Error durante la autenticación. Intenta de nuevo.';
      }
    });
  }

  closeModal() {
    this.close.emit();
  }
}
