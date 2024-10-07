import { render, screen } from '@testing-library/angular';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './shared/services/auth.service';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let authServiceMock: any;

  beforeEach(async () => {
    // Мокаємо AuthService для Jest
    authServiceMock = {
      LoginStatus: true,
      userLoginStatus: { next: jest.fn() }, // Мокаємо функцію next
      logout: jest.fn().mockResolvedValue(Promise.resolve()) // Мокаємо метод logout
    };
  });


  it('should call logout when logoutUser is triggered', async () => {
    const { fixture } = await render(AppComponent, {
      imports: [RouterTestingModule],
      providers: [{ provide: AuthService, useValue: authServiceMock }]
    });

    const appInstance = fixture.componentInstance;
    appInstance.logoutUser(); // Викликаємо метод logout

    expect(authServiceMock.logout).toHaveBeenCalled(); // Перевіряємо виклик
  });
});
