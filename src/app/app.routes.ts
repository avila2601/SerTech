import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './auth.guard';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { MyAppointmentsComponent } from './components/my-appointments/my-appointments.component';
import { AppointmentSummaryComponent } from './components/appointment-summary/appointment-summary.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about-us', component: AboutUsComponent },
  // Redirigir ruta antigua en español a la nueva en inglés
  { path: 'quienes-somos', redirectTo: 'about-us', pathMatch: 'full' },
  { path: 'clients', loadComponent: () => import('./components/clients/clients.component').then(m => m.ClientsComponent) },
  { path: 'services', loadComponent: () => import('./components/services/services.component').then(m => m.ServicesComponent) },
  { path: 'technicians', loadComponent: () => import('./components/technicians/technicians.component').then(m => m.TechniciansComponent) },
  { path: 'my-appointments', component: MyAppointmentsComponent, canActivate: [AuthGuard] },
  { path: 'debug', loadComponent: () => import('./components/debug/debug.component').then(m => m.DebugComponent) },
  { path: 'appointment-summary', component: AppointmentSummaryComponent },
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: '**', redirectTo: '' }
];
