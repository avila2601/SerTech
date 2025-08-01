import { Injectable } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const technicianLoggedIn = localStorage.getItem('technicianLoggedIn');
  const clientLoggedIn = localStorage.getItem('clientLoggedIn');
  const emailLogin = localStorage.getItem('emailLogin');

  if (technicianLoggedIn || clientLoggedIn || emailLogin) {
    return true;
  } else {
    // Redirigir al login en lugar de la página principal
    return router.createUrlTree(['/login']);
  }
};
