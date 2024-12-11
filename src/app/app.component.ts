import {
	ChangeDetectorRef,
	Component,
	DoCheck,
	HostListener,
	OnDestroy,
	OnInit,
} from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AppMaterialModule } from './app-material/app-material.module';
import { AuthService } from './shared/services/auth.service';
import { noop, Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { BotComponent } from './pages/bot/bot.component';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';
import { SpinnerService } from './shared/services/spinner.service';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet, AppMaterialModule, RouterLink, SpinnerComponent],
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, DoCheck, OnDestroy {
	destroy$ = new Subject<boolean>();
	events: string[] = [];
	opened = false;
	userStatus = false;
	isLoading: boolean;
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
		private spinnerStatusService: SpinnerService,
		private authService: AuthService,
		private cdr: ChangeDetectorRef
	) {}

	ngOnInit() {
    const loggedIn = localStorage.getItem('loggedIn')
    if(loggedIn) {
      if (this.authService.LoginStatus) {
        this.authService.userLoginStatus.next(true);
      }

      this.spinnerStatusService.spinnerStatus
        .pipe(takeUntil(this.destroy$))
        .subscribe(spinnerStatus => {
          this.isLoading = spinnerStatus;
        });
      this.resetLogoutTimer();
    }
	}
	ngDoCheck() {
	const loggedIn = localStorage.getItem('loggedIn')
    if(loggedIn) {
      this.userStatus = this.authService.LoginStatus;
    }
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
		this.destroy$.next(true);
		this.destroy$.complete();
	}

	openBotModal() {
		this.dialogWindow.open(BotComponent, {
			width: '700px',
			height: '800px',
			disableClose: true,
		});
	}
}
