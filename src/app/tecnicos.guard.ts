import { Injectable } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';

export const TecnicosGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const loggedTechnician = localStorage.getItem('tecnicoLogueado');
  if (loggedTechnician) {
    return true;
  } else {
    return router.createUrlTree(['/']);
  }
};
