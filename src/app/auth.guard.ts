import { Injectable } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const loggedTechnician = localStorage.getItem('loggedTechnician') || localStorage.getItem('tecnicoLogueado');
  const loggedClient = localStorage.getItem('loggedClient') || localStorage.getItem('clienteLogueado');
  const emailLogin = localStorage.getItem('emailLogin');

  if (loggedTechnician || loggedClient || emailLogin) {
    return true;
  } else {
    // Redirect to login instead of homepage
    return router.createUrlTree(['/login']);
  }
};
