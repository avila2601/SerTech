import { Injectable } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';

export const TecnicosGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const hasServicio = !!route.queryParamMap.get('servicio');
  if (hasServicio) {
    return true;
  } else {
    return router.createUrlTree(['/']);
  }
};
