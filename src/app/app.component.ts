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
  template: `
    <nav class="navbar">
      <div class="container">
        <div class="nav-brand">
          <h2>SerTech</h2>
        </div>

        <!-- Menú hamburguesa para móviles -->
        <div class="hamburger" (click)="toggleMenu()">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <ul class="nav-menu" [class.active]="isMenuOpen">
          <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="closeMenu()">Inicio</a></li>
          <li><a routerLink="/about-us" routerLinkActive="active" (click)="closeMenu()">¿Quienes Somos?</a></li>
          <li *ngIf="loggedTechnician || isLoggedAsClient">
            <a routerLink="/my-appointments" routerLinkActive="active" (click)="closeMenu()">Mis Citas</a>
          </li>
          <li *ngIf="!loggedTechnician && !isLoggedAsClient">
            <a href="#" routerLinkActive="active" class="" (click)="openTechniciansModal(); closeMenu(); $event.preventDefault()">Técnicos</a>
          </li>
          <li *ngIf="!isLoggedAsClient && !loggedTechnician">
            <a href="#" (click)="openLoginModal(); closeMenu(); $event.preventDefault()">Ingreso clientes</a>
          </li>
          <li *ngIf="loggedTechnician">
            <a href="#" (click)="openTechnicianReviewsModal(); closeMenu(); $event.preventDefault()">Mis reseñas</a>
          </li>
          <li *ngIf="loggedTechnician">
            <a href="#" (click)="logoutTechnician(); $event.preventDefault()">Cerrar sesión</a>
          </li>
          <li *ngIf="isLoggedAsClient">
            <a href="#" (click)="logoutClient(); $event.preventDefault()">Cerrar sesión</a>
          </li>
        </ul>
      </div>
    </nav>

    <main>
      <router-outlet></router-outlet>
    </main>

    <app-technician-login *ngIf="showTechniciansModal" (close)="closeTechniciansModal()" (loginSuccess)="loginTechnician($event)"></app-technician-login>
    <app-login *ngIf="showLoginModal" (close)="closeLoginModal()" (loginSuccess)="updateUserState()"></app-login>

    <app-technician-reviews-modal
      *ngIf="showTechnicianReviewsModal"
      [technicianId]="technicianIdForReviews"
      (close)="closeTechnicianReviewsModal()"
    ></app-technician-reviews-modal>

    <footer class="footer">
      <div class="container">
        <p>&copy; 2024 SerTech. Todos los derechos reservados.</p>
      </div>
    </footer>
  `,
  styles: [`
    .navbar {
      background: rgba(31, 41, 55, 0.9);
      backdrop-filter: blur(20px);
      padding: 1rem 0;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .nav-brand h2 {
      color: white;
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .nav-menu {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: 2rem;
    }

    .nav-menu a {
      color: #e0e0e0;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      transition: all 0.3s ease;
      font-weight: 500;
      font-size: 1rem;
    }

    .nav-menu a:hover,
    .nav-menu a.active {
      color: white;
      background: rgba(102, 126, 234, 0.2);
      font-size: 1.05rem;
      transform: translateY(-1px);
    }

    .hamburger {
      display: none;
      flex-direction: column;
      cursor: pointer;
      padding: 5px;
    }

    .hamburger span {
      width: 25px;
      height: 3px;
      background: #e0e0e0;
      margin: 3px 0;
      transition: 0.3s;
      border-radius: 2px;
    }

    main {
      min-height: calc(100vh - 140px);
      background: transparent;
    }

    .footer {
      background: rgba(31, 41, 55, 0.9);
      backdrop-filter: blur(20px);
      color: #e0e0e0;
      text-align: center;
      padding: 1rem 0;
      margin-top: auto;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    /* Responsive para tablets */
    @media (max-width: 768px) {
      .nav-brand h2 {
        font-size: 1.3rem;
      }

      .nav-menu {
        position: fixed;
        left: -100%;
        top: 70px;
        flex-direction: column;
        background: rgba(31, 41, 55, 0.95);
        backdrop-filter: blur(20px);
        width: 100%;
        text-align: center;
        transition: 0.3s;
        box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);
        padding: 2rem 0;
        gap: 1rem;
      }

      .nav-menu.active {
        left: 0;
      }

      .nav-menu a {
        padding: 1rem 2rem;
        font-size: 1.1rem;
        border-radius: 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .nav-menu a:hover,
      .nav-menu a.active {
        background: rgba(102, 126, 234, 0.3);
        font-size: 1.1rem;
        transform: none;
      }

      .hamburger {
        display: flex;
      }

      .hamburger.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
      }

      .hamburger.active span:nth-child(2) {
        opacity: 0;
      }

      .hamburger.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
      }
    }

    /* Responsive para móviles pequeños */
    @media (max-width: 480px) {
      .container {
        padding: 0 15px;
      }

      .nav-brand h2 {
        font-size: 1.2rem;
      }

      .nav-menu {
        top: 65px;
      }

      .nav-menu a {
        padding: 0.8rem 1.5rem;
        font-size: 1rem;
      }
    }
  `]
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
  }

  logoutTechnician() {
    this.loggedTechnician = null;
    localStorage.removeItem('loggedTechnician');
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
    localStorage.removeItem('loggedClient');
    localStorage.removeItem('emailLogin');
    this.router.navigate(['/']);
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
