import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { SpinnerService } from '../../shared/services/spinner.service';
import { AuthService } from '../../shared/services/auth.service';
import { tap } from 'rxjs';
import { Games } from '../../shared/models/games.interface';

/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unused-vars */
export const profileResolver: ResolveFn<Games> = (route, state) => {
	const spinnerService = inject(SpinnerService);
	const authService = inject(AuthService);
	/* eslint-disable  @typescript-eslint/no-unused-vars */
	return authService.user$.pipe(
		tap(user => {
			return spinnerService.proceedSpinnerStatus(false);
		})
	);
};
