import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // ← check if running in browser before accessing localStorage
  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('token');
    if (token) {
      return true;
    } else {
      router.navigate(['/login']);
      return false;
    }
  }

  // on server side, just allow — guard will run again on browser
  return true;
};