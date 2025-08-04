import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'quienes-somos', loadComponent: () => import('./components/quienes-somos/quienes-somos.component').then(m => m.QuienesSomosComponent) },
  { path: 'clientes', loadComponent: () => import('./components/clientes/clientes.component').then(m => m.ClientesComponent) },
  { path: 'servicios', loadComponent: () => import('./components/servicios/servicios.component').then(m => m.ServiciosComponent) },
  { path: 'services', loadComponent: () => import('./components/services/services.component').then(m => m.ServicesComponent) },
  { path: 'tecnicos', loadComponent: () => import('./components/tecnicos/tecnicos.component').then(m => m.TecnicosComponent) },
  { path: 'technicians', loadComponent: () => import('./components/technicians/technicians.component').then(m => m.TechniciansComponent) },
  { path: 'mis-citas', loadComponent: () => import('./components/mis-citas/mis-citas.component').then(m => m.MisCitasComponent), canActivate: [AuthGuard] },
  { path: 'debug', loadComponent: () => import('./components/debug/debug.component').then(m => m.DebugComponent) },
  { path: 'resumen-cita', loadComponent: () => import('./components/resumen-cita/resumen-cita.component').then(m => m.ResumenCitaComponent) },
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: '**', redirectTo: '' }
];
