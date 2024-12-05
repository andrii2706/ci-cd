import { CanActivateFn, CanDeactivateFn } from '@angular/router';
import { ErrorService } from '../services/error.service';
import { inject } from '@angular/core';

export const errorPageGuard: CanActivateFn | CanDeactivateFn<boolean> = () => {
	const errorService = inject(ErrorService);
	console.log(errorService.requestError.value);
	return errorService.requestError.value;
};
