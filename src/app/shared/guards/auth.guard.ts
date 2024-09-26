import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from "../services/auth.service";
import {inject} from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackbarComponent} from "../components/snackbar/snackbar.component";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const snackbar = inject(MatSnackBar);
  const router = inject(Router);

  if (authService.LoginStatus) {
    return true;
  } else {
    snackbar.openFromComponent(SnackbarComponent, {
      duration: 5000,
      data: { text: 'You are not logged in yet.', status: 'error' },
      verticalPosition: 'top',
      horizontalPosition: 'end',
    });
    router.navigate(['/login']);
    return false;
  }
};
