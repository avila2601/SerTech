import { Injectable } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';

export const TecnicosGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const tecnicoLogueado = localStorage.getItem('tecnicoLogueado');
  if (tecnicoLogueado) {
    return true;
  } else {
    return router.createUrlTree(['/']);
  }
};
