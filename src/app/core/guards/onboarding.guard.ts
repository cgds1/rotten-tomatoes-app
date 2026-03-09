import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';

const ONBOARDING_KEY = 'hasSeenOnboarding';

export const onboardingGuard: CanActivateFn = async () => {
  const storage = inject(StorageService);
  const auth = inject(AuthService);
  const router = inject(Router);

  const hasSeenOnboarding = await storage.get<boolean>(ONBOARDING_KEY);

  if (!hasSeenOnboarding) {
    return router.createUrlTree(['/onboarding']);
  }

  if (auth.isLoggedIn) {
    return router.createUrlTree(['/tabs/movies']);
  }

  return router.createUrlTree(['/auth/login']);
};
