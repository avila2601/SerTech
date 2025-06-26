import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TecnicosGuard } from './tecnicos.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'informacion-personal', loadComponent: () => import('./components/informacion-personal/informacion-personal.component').then(m => m.InformacionPersonalComponent) },
  { path: 'servicios', loadComponent: () => import('./components/servicios/servicios.component').then(m => m.ServiciosComponent) },
  { path: 'tecnicos', loadComponent: () => import('./components/tecnicos/tecnicos.component').then(m => m.TecnicosComponent), canActivate: [TecnicosGuard] },
  { path: 'mis-citas', loadComponent: () => import('./components/mis-citas/mis-citas.component').then(m => m.MisCitasComponent) },
  { path: 'debug', loadComponent: () => import('./components/debug/debug.component').then(m => m.DebugComponent) },
  { path: 'resumen-cita', loadComponent: () => import('./components/resumen-cita/resumen-cita.component').then(m => m.ResumenCitaComponent) },
  { path: '**', redirectTo: '' }
];
