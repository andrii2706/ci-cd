import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AuthComponent} from './auth.component';
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {AngularFireModule} from "@angular/fire/compat";
import {environment} from "../../../environment/environment";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {AuthService} from "../../shared/services/auth.service";

//TODO write unit test

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let authService: AuthService;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, AngularFireModule.initializeApp(environment.firebaseConfig)],
      providers: [HttpClient],
      declarations: [AuthComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AuthComponent);
    authService = TestBed.inject(AuthService);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should sign up", () => {
    component.signUp();
    component.signInForm = true;
    expect(component.signInForm).toBe(true);
  });

  it("should submitRegister", () => {
    const signInSpy = jest.spyOn(authService, 'signInWithCredentials').mockReturnValue();
    component.registerForm.setValue({
      email: 'test@example.com',
      password: 'testpassword'
    });
    component.submitRegister();

    expect(signInSpy).toHaveBeenCalledWith(
      'test@example.com',
      'testpassword'
    );
  });

  it("should submitGoogleAuth", () => {
    const signInSpy = jest.spyOn(authService, 'googleLogin').mockReturnValue();
    component.submitGoogleAuth();

    expect(signInSpy).toHaveBeenCalled();
  });

  it("should cancelSubmitAuthForm", () => {
    component.signInForm = true;
    component.cancelSubmitAuthForm();
    component.authForm.reset();

    expect(component.signInForm).toBe(false);
  });

  it("should submitAuth", () => {
    component.authForm.setValue({
      email: 'test@example.com',
      password: 'testpassword'
    });
    const signInSpy = jest.spyOn(authService, 'loginWithCredentials').mockResolvedValue()
    component.submitAuth()

    expect(signInSpy).toHaveBeenCalledWith(
      'test@example.com',
      'testpassword'
    );
  })

});
