import { Injectable } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const tecnicoLogueado = localStorage.getItem('tecnicoLogueado');
  const clienteLogueado = localStorage.getItem('clienteLogueado');

  if (tecnicoLogueado || clienteLogueado) {
    return true;
  } else {
    // Redirigir al login en lugar de la página principal
    return router.createUrlTree(['/login']);
  }
};
