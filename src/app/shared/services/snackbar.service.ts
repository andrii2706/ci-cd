import { Injectable } from '@angular/core';
import {
	MatSnackBar,
	MatSnackBarHorizontalPosition,
	MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { SnackbarComponent } from '../components/snackbar/snackbar.component';

@Injectable({
	providedIn: 'root',
})
export class SnackbarService {
	constructor(private snackbar: MatSnackBar) {}

	message(
		data: { text: string; status: string } | string,
		verticalPosition: MatSnackBarVerticalPosition,
		horizontalPosition: MatSnackBarHorizontalPosition,
		duration?: number
	) {
		this.snackbar.openFromComponent(SnackbarComponent, {
			duration,
			data,
			verticalPosition,
			horizontalPosition,
		});
	}

	success(
		data: { text: string; status: string } | string,
		verticalPosition: MatSnackBarVerticalPosition,
		horizontalPosition: MatSnackBarHorizontalPosition,
		duration?: number
	) {
		this.snackbar.openFromComponent(SnackbarComponent, {
			duration,
			data,
			horizontalPosition,
			verticalPosition,
		});
	}

	error(
		data: { text: string; status: string } | string,
		verticalPosition: MatSnackBarVerticalPosition,
		horizontalPosition: MatSnackBarHorizontalPosition,
		duration?: number
	) {
		this.snackbar.openFromComponent(SnackbarComponent, {
			duration,
			data,
			horizontalPosition,
			verticalPosition,
		});
	}
}
