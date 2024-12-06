import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthComponent } from './auth.component';
import { AuthService } from '../../shared/services/auth.service';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let authServiceMock: jest.Mocked<AuthService>;

  beforeEach(async () => {
    authServiceMock = {
      loginWithCredentials: jest.fn().mockResolvedValue(true),
      googleLogin: jest.fn(),
      signInWithCredentials: jest.fn(),
      forgotPassword: jest.fn().mockResolvedValue(true),
    } as unknown as jest.Mocked<AuthService>;

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [AuthComponent],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize all forms on ngOnInit', () => {
    component.ngOnInit();
    expect(component.authForm).toBeDefined();
    expect(component.registerForm).toBeDefined();
    expect(component.resetPasswordForm).toBeDefined();
  });

  it('should call AuthService.loginWithCredentials on submitAuth', async () => {
    component.authForm.setValue({
      email: 'test@example.com',
      password: 'password123',
    });

    await component.submitAuth();

    expect(authServiceMock.loginWithCredentials).toHaveBeenCalledWith(
      'test@example.com',
      'password123'
    );
  });

  it('should call AuthService.googleLogin on submitGoogleAuth', () => {
    component.submitGoogleAuth();

    expect(authServiceMock.googleLogin).toHaveBeenCalled();
  });

  it('should reset authForm and update signInForm on cancelSubmitAuthForm', () => {
    component.signInForm = true;
    component.authForm.setValue({
      email: 'test@example.com',
      password: 'password123',
    });

    component.cancelSubmitAuthForm();

    expect(component.signInForm).toBe(false);
    expect(component.authForm.value).toEqual({
      email: null,
      password: null,
    });
  });

  it('should call AuthService.signInWithCredentials on submitRegister', () => {
    component.registerForm.setValue({
      email: 'newuser@example.com',
      password: 'password1234',
    });

    component.submitRegister();

    expect(authServiceMock.signInWithCredentials).toHaveBeenCalledWith(
      'newuser@example.com',
      'password1234'
    );
  });

  it('should toggle signInForm on signUp', () => {
    component.signInForm = false;

    component.signUp();

    expect(component.signInForm).toBe(true);
  });

  it('should toggle showForgotPassword on forgotPasswordFormShow', () => {
    component.showForgotPassword = false;

    component.forgotPasswordFormShow();

    expect(component.showForgotPassword).toBe(true);
    expect(component.signInForm).toBe(false);
  });

  it('should call AuthService.forgotPassword on forgotPasswordFormSend', async () => {
    component.resetPasswordForm.setValue({
      email: 'forgot@example.com',
    });

    await component.forgotPasswordFormSend();

    expect(authServiceMock.forgotPassword).toHaveBeenCalledWith(
      'forgot@example.com'
    );
    expect(component.showForgotPassword).toBe(false);
    expect(component.signInForm).toBe(false);
  });

  it('should log error if forgotPasswordFormSend fails', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    authServiceMock.forgotPassword.mockRejectedValueOnce(new Error('Failed'));

    component.resetPasswordForm.setValue({
      email: 'error@example.com',
    });

    await component.forgotPasswordFormSend();

    expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
  });
});
