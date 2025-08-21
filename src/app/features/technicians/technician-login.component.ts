import { Component, EventEmitter, Output, HostListener, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GetTechnicianByIdUseCase } from '../../core/application/use-cases/technicians/get-technician-by-id.usecase';

@Component({
  selector: 'app-technician-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './technician-login.component.html',
  styleUrls: ['./technician-login.component.scss']
})
export class TechnicianLoginComponent implements AfterViewInit {
  @Output() close = new EventEmitter<void>();
  @Output() loginSuccess = new EventEmitter<string>();
  @ViewChild('technicianIdInput') technicianIdInput!: ElementRef<HTMLInputElement>;

  technicianId: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private getTechnicianByIdUseCase: GetTechnicianByIdUseCase) {}

  ngAfterViewInit() {
    // Usar setTimeout para asegurar que el DOM esté completamente renderizado
    setTimeout(() => {
      this.technicianIdInput.nativeElement.focus();
    }, 100);
  }

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
    this.getTechnicianByIdUseCase.execute(this.technicianId).subscribe(technician => {
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
