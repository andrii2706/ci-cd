import {
	Component,
	DoCheck,
	HostListener,
	OnDestroy,
	OnInit,
} from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AppMaterialModule } from './app-material/app-material.module';
import { AuthService } from './shared/services/auth.service';
import { noop } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { BotComponent } from './pages/bot/bot.component';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet, AppMaterialModule, RouterLink],
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'], // змінив на 'styleUrls' (зверни увагу на помилку в 'styleUrl')
})
export class AppComponent implements OnInit, DoCheck, OnDestroy {
	events: string[] = [];
	opened = false;
	userStatus = false;
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
		private dialogWindow: MatDialog,
		private authService: AuthService
	) {}

	ngOnInit() {
		if (this.authService.LoginStatus) {
			this.authService.userLoginStatus.next(true);
			this.router.navigate(['/home']);
		}
		this.resetLogoutTimer();
	}
	ngDoCheck() {
		this.userStatus = this.authService.LoginStatus;
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

	openBotModal() {
		this.dialogWindow.open(BotComponent, {
			width: '700px',
			height: '800px',
      disableClose: true,
		});
	}
}
