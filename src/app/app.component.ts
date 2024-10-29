import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import {
	NavigationEnd,
	Router,
	RouterLink,
	RouterOutlet,
} from '@angular/router';
import { AppMaterialModule } from './app-material/app-material.module';
import { AuthService } from './shared/services/auth.service';
import { filter, noop } from 'rxjs';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet, AppMaterialModule, RouterLink],
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'], // змінив на 'styleUrls' (зверни увагу на помилку в 'styleUrl')
})
export class AppComponent implements OnInit, OnDestroy {
	events: string[] = [];
	opened = false;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  private logoutTimer: any;
  private readonly timeoutDuration = 8 * 60 * 60 * 1000;

  @HostListener('document:mousemove')
  @HostListener('document:keydown')
  @HostListener('document:click')
  handleUserActivity() {
    this.resetLogoutTimer();
  }

	constructor(
		private router: Router,
		private authService: AuthService
	) {}

	ngOnInit() {
		if (this.authService.LoginStatus) {
			this.authService.userLoginStatus.next(true);
			this.router.events
				.pipe(filter(event => event instanceof NavigationEnd))
				/* eslint-disable  @typescript-eslint/no-explicit-any */
				.subscribe((event: any) => {
					if (event.url === '/') {
						this.router.navigate(['home']);
					}
				});
		}
    this.resetLogoutTimer();
	}


  private resetLogoutTimer() {
    this.clearLogoutTimer();

    this.logoutTimer = setTimeout(() => {
      this.logoutUser();
    }, this.timeoutDuration);
  }

  private clearLogoutTimer() {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }
  }


	logoutUser() {
		this.authService.logout().then(() => noop());
	}

	goToProfile() {
		this.router.navigateByUrl('profile');
	}

  ngOnDestroy() {
    this.clearLogoutTimer();
  }

}
