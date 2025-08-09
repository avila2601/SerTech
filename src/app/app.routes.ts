import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  // Primary English routes
  { path: '', component: HomeComponent },
  { path: 'about-us', loadComponent: () => import('./components/about-us/about-us.component').then(m => m.AboutUsComponent) },
  { path: 'clients', loadComponent: () => import('./components/clients/clients.component').then(m => m.ClientsComponent) },
  { path: 'services', loadComponent: () => import('./components/services/services.component').then(m => m.ServicesComponent) },
  { path: 'technicians', loadComponent: () => import('./components/technicians/technicians.component').then(m => m.TechniciansComponent) },
  { path: 'my-appointments', loadComponent: () => import('./components/my-appointments/my-appointments.component').then(m => m.MyAppointmentsComponent), canActivate: [AuthGuard] },
  { path: 'reviews', loadComponent: () => import('./components/reviews/reviews.component').then(m => m.ReviewsComponent) },
  { path: 'appointment-summary', loadComponent: () => import('./components/appointment-summary/appointment-summary.component').then(m => m.AppointmentSummaryComponent) },
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'debug', loadComponent: () => import('./components/debug/debug.component').then(m => m.DebugComponent) },

  // Fallback
  { path: '**', redirectTo: '' }
];
