import { render } from '@testing-library/angular';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './shared/services/auth.service';


describe('AppComponent', () => {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  let authServiceMock: any;

  beforeEach(async () => {
    authServiceMock = {
      LoginStatus: true,
      userLoginStatus: { next: jest.fn() },
      logout: jest.fn().mockResolvedValue(Promise.resolve())
    };
  });


  it('should call logout when logoutUser is triggered', async () => {
    const { fixture } = await render(AppComponent, {
      imports: [RouterTestingModule],
      providers: [{ provide: AuthService, useValue: authServiceMock }]
    });

    const appInstance = fixture.componentInstance;
    appInstance.logoutUser();

    expect(authServiceMock.logout).toHaveBeenCalled();
  });
});
