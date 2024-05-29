import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import AuthGlobalService from '../services/global/auth-global.service';

const userGuard: CanActivateFn = (
  _,
  state,
  authStore = inject(AuthGlobalService),
  router = inject(Router)
) => {
  const user = authStore.user();

  if (user) {
    return true;
  }

  router.navigate(['/auth']);
  return false;
};

export default userGuard;
