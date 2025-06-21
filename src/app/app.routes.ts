import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'agendar', loadComponent: () => import('./components/agendar/agendar.component').then(m => m.AgendarComponent) },
  { path: 'servicios', loadComponent: () => import('./components/servicios/servicios.component').then(m => m.ServiciosComponent) },
  { path: 'tecnicos', loadComponent: () => import('./components/tecnicos/tecnicos.component').then(m => m.TecnicosComponent) },
  { path: 'mis-citas', loadComponent: () => import('./components/mis-citas/mis-citas.component').then(m => m.MisCitasComponent) },
  { path: '**', redirectTo: '' }
];
