import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorService } from './shared/services/error.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
	const router = inject(Router);
  const errorService = inject(ErrorService);

	return next(req).pipe(
		catchError((error: HttpErrorResponse) => {
			let errorMsg = '';
			if (error.error instanceof ErrorEvent) {
				errorMsg = `Error: ${error.error.message}`;
			} else {
				errorMsg = `Error Code: ${error.status}\nMessage: ${error.message}`;

				if (error.status === 404 || error.status === 500) {
					router.navigate(['/error']);
				}
			}
      errorService.fullErrorObject(true)
			return throwError(() => new Error(errorMsg));
		})
	);
};
