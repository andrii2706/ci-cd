import { Component, OnInit } from '@angular/core';
import {
	AbstractControl,
	FormControl,
	FormGroup,
	ValidationErrors,
	ValidatorFn,
	Validators,
} from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { takeUntil } from 'rxjs';
import { ClearObservableDirective } from '../../shared/classes';
import { SpinnerService } from '../../shared/services/spinner.service';
import { SnackbarService } from '../../shared/services/snackbar.service';

@Component({
	selector: 'app-auth',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.scss', '../../shared/styles/shared.scss'],
})
export class AuthComponent extends ClearObservableDirective implements OnInit {
	authForm: FormGroup;
	registerForm: FormGroup;
	resetPasswordForm: FormGroup;
	signInForm: boolean;
	showForgotPassword: boolean;
	isLoading: boolean;

	constructor(
		private authService: AuthService,
		private spinnerService: SpinnerService,
		private snackbarService: SnackbarService
	) {
		super();
		this.spinnerService.proceedSpinnerStatus(false);
	}

	ngOnInit() {
		this.initAuthForm();
		this.initRegisterForm();
		this.forgotPasswordFormInit();
		this.spinnerService.spinnerStatus
			.pipe(takeUntil(this.destroy$))
			.subscribe(isLoading => {
				this.isLoading = isLoading;
			});
	}

	initAuthForm() {
		this.authForm = new FormGroup({
			email: new FormControl('', [Validators.required, Validators.email]),
			password: new FormControl('', [
				Validators.required,
				Validators.minLength(8),
				this.noWhitespaceValidator(),
			]),
		});
	}

	initRegisterForm() {
		this.registerForm = new FormGroup({
			email: new FormControl('', [Validators.required, Validators.email]),
			password: new FormControl('', [
				Validators.required,
				Validators.minLength(8),
				this.noWhitespaceValidator(),
			]),
		});
	}

	forgotPasswordFormInit() {
		this.resetPasswordForm = new FormGroup({
			email: new FormControl('', [Validators.required, Validators.email]),
		});
	}

	noWhitespaceValidator(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const isWhitespace = (control.value || '').trim().length === 0;
			return isWhitespace ? { whitespace: true } : null;
		};
	}

	submitAuth() {
		const emailCreads = this.authForm.get('email')?.value;
		const passwordCreads = this.authForm.get('password')?.value;
		this.authService.loginWithCredentials(emailCreads, passwordCreads);
	}

	submitGoogleAuth() {
		this.authService.googleLogin();
	}

	cancelSubmitAuthForm() {
		if (this.signInForm) {
			this.signInForm = false;
		}
		this.authForm.reset();
		this.registerForm.reset();
		this.resetPasswordForm.reset();
	}

	submitRegister() {
		this.authService
			.signInWithCredentials(
				this.registerForm.get('email')?.value,
				this.registerForm.get('password')?.value
			)
			?.then(() => {
				this.spinnerService.proceedSpinnerStatus(true);
			})
			.finally(() => {
				this.spinnerService.proceedSpinnerStatus(false);
			});
	}

	signUp() {
		this.signInForm = true;
		this.authForm.reset();
	}

	forgotPasswordFormShow() {
		this.showForgotPassword = true;
		this.signInForm = false;
		this.authForm.reset();
	}

	forgotPasswordFormSend() {
		this.authService
			.forgotPassword(this.resetPasswordForm.get('email')?.value)
			.then(() => {
				this.showForgotPassword = false;
				this.signInForm = false;
			})
			.catch(() => {
				this.snackbarService.error(
					{ text: 'User update is not responding', status: 'error' },
					'top',
					'center',
					5000
				);
			});
	}
}
