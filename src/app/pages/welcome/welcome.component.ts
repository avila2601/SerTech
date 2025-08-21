import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {
  // Datos del proyecto
  projectInfo = {
    title: 'SerTech',
    subtitle: 'Sistema de Gestión de Servicios Técnicos',
    description: 'Aplicación web para gestión de citas y servicios técnicos desarrollada con Clean Architecture y las mejores prácticas de Angular.',
    technologies: ['Angular 18', 'TypeScript', 'Clean Architecture', 'RxJS']
  };

  // Solo credenciales de técnico
  technicianCredentials = {
    id: '1',
    password: 'clave1'
  };

  constructor(private router: Router) {}

  // Función para copiar credenciales
  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      alert('Credenciales copiadas al portapapeles!');
    }).catch(() => {
      alert('Error al copiar las credenciales');
    });
  }
}
