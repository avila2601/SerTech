import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TechnicianLoginComponent } from './components/technicians/technician-login.component';
import { TechnicianReviewsModalComponent } from './components/technicians/technician-reviews-modal.component';
import { Router } from '@angular/router';
import { LoginComponent } from './components/login/login.component';

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
