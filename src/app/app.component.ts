import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TechnicianLoginComponent } from './features/technicians/technician-login.component';
import { TechnicianReviewsModalComponent } from './features/technicians/technician-reviews-modal.component';
import { Router } from '@angular/router';
import { LoginComponent } from './features/authentication/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, LoginComponent, TechnicianLoginComponent, TechnicianReviewsModalComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'sertech';
  isMenuOpen = false;
  showTechniciansModal = false;
  loggedTechnician: string | null = null;
  showLoginModal = false;
  loggedClient: string | null = null;
  showTechnicianReviewsModal = false;
  technicianIdForReviews: string = '';

  constructor(private router: Router) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  openTechniciansModal() {
    this.showTechniciansModal = true;
  }

  // Nueva función para abrir modal con auto-rellenado
  openTechniciansModalWithCredentials(details: any) {
    this.showTechniciansModal = true;

    // Esperar a que se renderice el modal y luego auto-rellenar
    setTimeout(() => {
      this.autoFillCredentials(details.credentials);
    }, 100);
  }

  private autoFillCredentials(credentials: any) {
    const technicianIdInput = document.querySelector('#technicianId') as HTMLInputElement;
    const passwordInput = document.querySelector('#password') as HTMLInputElement;

    if (technicianIdInput && passwordInput) {
      // Rellenar los campos
      technicianIdInput.value = credentials.id;
      passwordInput.value = credentials.password;

      // Disparar eventos para que Angular detecte los cambios
      technicianIdInput.dispatchEvent(new Event('input', { bubbles: true }));
      passwordInput.dispatchEvent(new Event('input', { bubbles: true }));

      // Hacer focus en el botón de submit
      setTimeout(() => {
        const submitButton = document.querySelector('.btn-ingresar') as HTMLElement;
        if (submitButton) {
          submitButton.focus();
        }
      }, 50);

      // Mostrar mensaje de confirmación
      setTimeout(() => {
        alert('¡Credenciales rellenadas automáticamente! Haz clic en "Ingresar" para continuar.');
      }, 200);
    }
  }

  closeTechniciansModal() {
    this.showTechniciansModal = false;
  }

  loginTechnician(technicianId: string) {
    this.loggedTechnician = technicianId;
    localStorage.setItem('loggedTechnician', technicianId);
    this.closeTechniciansModal();
    this.router.navigate(['/my-appointments']);
  }

  logoutTechnician() {
    this.loggedTechnician = null;
    // Limpiar todo el localStorage
    localStorage.clear();
    this.reloadUserState(); // Actualizar el estado del navbar
    this.router.navigate(['/']);
  }

  openLoginModal() {
    this.showLoginModal = true;
  }

  closeLoginModal() {
    this.showLoginModal = false;
    this.reloadUserState();
  }

  logoutClient() {
    this.loggedClient = null;
    // Limpiar todo el localStorage
    localStorage.clear();
    this.reloadUserState(); // Actualizar el estado del navbar
    this.router.navigate(['/']);
  }

  // Función para limpiar completamente localStorage
  clearAllUserData() {
    this.loggedClient = null;
    this.loggedTechnician = null;
    // Limpiar todo el localStorage
    localStorage.clear();
  }

  openTechnicianReviewsModal() {
    this.technicianIdForReviews = this.loggedTechnician || '';
    this.showTechnicianReviewsModal = true;
  }

  closeTechnicianReviewsModal() {
    this.showTechnicianReviewsModal = false;
    this.technicianIdForReviews = '';
  }

  ngOnInit() {
    this.reloadUserState();

    // Clean up emailLogin if no client is logged in
    if (!localStorage.getItem('loggedClient')) {
      localStorage.removeItem('emailLogin');
    }

    // Listen to localStorage changes to update navbar
    window.addEventListener('storage', (event) => {
      if (event.key?.includes('logged') || event.key === 'emailLogin') {
        this.reloadUserState();
      }
    });

    // Escuchar evento personalizado para abrir modal de técnicos con auto-rellenado
    window.addEventListener('openTechnicianLogin', (event: any) => {
      this.openTechniciansModalWithCredentials(event.detail);
    });
  }

  reloadUserState() {
    this.loggedTechnician = localStorage.getItem('loggedTechnician');
    this.loggedClient = localStorage.getItem('loggedClient');
  }

  // Método público para que otros componentes puedan actualizar el navbar
  public updateUserState() {
    this.reloadUserState();
  }

  get isLoggedAsClient(): boolean {
    return !!(localStorage.getItem('loggedClient') || localStorage.getItem('emailLogin'));
  }
}
