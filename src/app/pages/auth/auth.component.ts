import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../shared/services/auth.service";
import {noop} from "rxjs";
import {ClearObservableDirective} from "../../shared/classes";


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent extends ClearObservableDirective implements OnInit {
  authForm: FormGroup;
  registerForm: FormGroup;
  signInForm: boolean;

  constructor(private authService: AuthService) {
    super()
  }

  ngOnInit() {
    this.initAuthForm();
    this.initRegisterForm();
  }

  initAuthForm() {
    this.authForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    })
  }

  initRegisterForm() {
    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    })
  }

  submitAuth() {
    const emailCreads = this.authForm.get('email')?.value;
    const passwordCreads = this.authForm.get('password')?.value
    this.authService.loginWithCredentials(emailCreads, passwordCreads).then(() => noop());
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
    this.authService.signInWithCredentials(this.registerForm.get('email')?.value, this.registerForm.get('password')?.value);
  }

  signUp() {
    this.signInForm = true
  }
}
