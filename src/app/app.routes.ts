import { Routes } from '@angular/router';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard, TechniciansGuard } from './core/application/guards';

export const routes: Routes = [
  // Home page as main (Inicio)
  { path: '', component: HomeComponent },

  // Welcome page for recruiters/demo
  { path: 'welcome', component: WelcomeComponent },

  // Application routes
  { path: 'about-us', loadComponent: () => import('./pages/about-us/about-us.component').then(m => m.AboutUsComponent) },
  { path: 'clients', loadComponent: () => import('./features/clients/clients.component').then(m => m.ClientsComponent) },
  { path: 'services', loadComponent: () => import('./features/services/services.component').then(m => m.ServicesComponent) },
  { path: 'technicians', loadComponent: () => import('./features/technicians/technicians.component').then(m => m.TechniciansComponent) },
  { path: 'my-appointments', loadComponent: () => import('./features/appointments/my-appointments.component').then(m => m.MyAppointmentsComponent), canActivate: [AuthGuard] },
  { path: 'reviews', loadComponent: () => import('./features/reviews/reviews.component').then(m => m.ReviewsComponent) },
  { path: 'appointment-summary', loadComponent: () => import('./features/appointments/appointment-summary.component').then(m => m.AppointmentSummaryComponent) },
  { path: 'login', loadComponent: () => import('./features/authentication/login.component').then(m => m.LoginComponent) },
  { path: 'debug', loadComponent: () => import('./admin/debug/debug.component').then(m => m.DebugComponent) },

  // Fallback
  { path: '**', redirectTo: '' }
];
