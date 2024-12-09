import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { noop } from 'rxjs';
import { ClearObservableDirective } from '../../shared/classes';
import { SnackbarComponent } from '../../shared/components/snackbar/snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-auth',
	templateUrl: './auth.component.html',
	styleUrl: './auth.component.scss',
})
export class AuthComponent extends ClearObservableDirective implements OnInit {
	authForm: FormGroup;
	registerForm: FormGroup;
	resetPasswordForm: FormGroup;
	signInForm: boolean;
	showForgotPassword: boolean;

	constructor(private authService: AuthService, private snackbarComponent: MatSnackBar) {
		super();
	}

	ngOnInit() {
		this.initAuthForm();
		this.initRegisterForm();
		this.forgotPasswordFormInit();
	}

	initAuthForm() {
		this.authForm = new FormGroup({
			email: new FormControl('', [Validators.required, Validators.email]),
			password: new FormControl('', [Validators.required]),
		});
	}

	initRegisterForm() {
		this.registerForm = new FormGroup({
			email: new FormControl('', [Validators.required, Validators.email]),
			password: new FormControl('', [Validators.required, Validators.min(8)]),
		});
	}

	forgotPasswordFormInit() {
		this.resetPasswordForm = new FormGroup({
			email: new FormControl('', [Validators.required, Validators.email]),
		});
	}

	submitAuth() {
		const emailCreads = this.authForm.get('email')?.value;
		const passwordCreads = this.authForm.get('password')?.value;
		this.authService
			.loginWithCredentials(emailCreads, passwordCreads)
			.then(() => noop());
	}

	submitGoogleAuth() {
		this.authService.googleLogin();
	}

	cancelSubmitAuthForm() {
		if (this.signInForm) {
			this.signInForm = false;
		}
		this.authForm.reset();
	}

	submitRegister() {
		this.authService
			.signInWithCredentials(
				this.registerForm.get('email')?.value,
				this.registerForm.get('password')?.value
			)
			?.then(() => {
				noop();
			});
	}

	signUp() {
		this.signInForm = true;
	}

	forgotPasswordFormShow() {
		this.showForgotPassword = true;
		this.signInForm = false;
	}

	forgotPasswordFormSend() {
		this.authService
			.forgotPassword(this.resetPasswordForm.get('email')?.value)
			.then(() => {
				this.showForgotPassword = false;
				this.signInForm = false;
			})
      /* eslint-disable  @typescript-eslint/no-unused-vars */
			.catch(error => {
        this.snackbarComponent.openFromComponent(SnackbarComponent, {
          duration: 5000,
          data: { text: 'User update is not responding', status: 'error' },
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
			});
	}
}
