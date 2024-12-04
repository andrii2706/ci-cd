import { CanActivateFn, CanDeactivateFn } from '@angular/router';
import { ErrorService } from '../services/error.service';
import { inject } from '@angular/core';

export const errorPageGuard: CanActivateFn | CanDeactivateFn<boolean> = () => {
	const errorService = inject(ErrorService);
	return errorService.requestError.value;
};
