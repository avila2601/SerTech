import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TechnicianLoginComponent } from './components/technicians/technician-login.component';
import { Router } from '@angular/router';
import { UserStateService } from './services/user-state.service';
import { LoginComponent } from './components/login/login.component';
import { TechnicianReviewsModalComponent } from './components/technicians/technician-reviews-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, TechnicianLoginComponent, LoginComponent, TechnicianReviewsModalComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'sertech';
  isMenuOpen = false;
  mostrarModalTecnicos = false;
  tecnicoLogueado: string | null = null;
  mostrarModalLogin = false;
  clienteLogueado: string | null = null;
  mostrarModalResenasTecnico = false;
  tecnicoIdResenas: string = '';

  constructor(private router: Router, private userState: UserStateService) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  abrirModalTecnicos() {
    this.mostrarModalTecnicos = true;
  }

  cerrarModalTecnicos() {
    this.mostrarModalTecnicos = false;
  }

  loginTecnico(tecnicoId: string) {
    this.tecnicoLogueado = tecnicoId;
    localStorage.setItem('tecnicoLogueado', tecnicoId);
  }

  logoutTecnico() {
    this.tecnicoLogueado = null;
    localStorage.removeItem('tecnicoLogueado');
    this.router.navigate(['/']);
  }

  abrirModalLogin() {
    this.mostrarModalLogin = true;
  }

  cerrarModalLogin() {
    this.mostrarModalLogin = false;
    this.recargarEstadoUsuario();
  }

  logoutCliente() {
    this.clienteLogueado = null;
    localStorage.removeItem('clienteLogueado');
    localStorage.removeItem('emailLogin');
    this.router.navigate(['/']);
  }

  abrirModalResenasTecnico() {
    this.tecnicoIdResenas = this.tecnicoLogueado || '';
    this.mostrarModalResenasTecnico = true;
  }

  cerrarModalResenasTecnico() {
    this.mostrarModalResenasTecnico = false;
    this.tecnicoIdResenas = '';
  }

  ngOnInit() {
    this.recargarEstadoUsuario();

    // Si no hay cliente logueado, limpiar emailLogin
    if (!localStorage.getItem('clienteLogueado')) {
      localStorage.removeItem('emailLogin');
    }

    // Escuchar cambios en localStorage para actualizar el navbar
    window.addEventListener('storage', (event) => {
      if (event.key === 'clienteLogueado' || event.key === 'tecnicoLogueado') {
        this.recargarEstadoUsuario();
      }
    });
    // Suscribirse a cambios de estado de usuario de AppointmentSummary
    this.userState.userStatus$.subscribe(() => {
      this.recargarEstadoUsuario();
    });
  }

  recargarEstadoUsuario() {
    this.tecnicoLogueado = localStorage.getItem('tecnicoLogueado');
    this.clienteLogueado = localStorage.getItem('clienteLogueado');
  }

  // Public method for other components to update navbar
  public updateUserStatus() {
    this.recargarEstadoUsuario();
  }

  get estaLogueadoComoCliente(): boolean {
    return !!localStorage.getItem('clienteLogueado') || !!localStorage.getItem('emailLogin');
  }
}
