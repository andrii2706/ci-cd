import {
	ChangeDetectorRef,
	Component,
	HostListener,
	inject,
	OnDestroy,
	OnInit,
} from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AppMaterialModule } from './app-material/app-material.module';
import { AuthService } from './shared/services/auth.service';
import { noop, Observable, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { BotComponent } from './pages/bot/bot.component';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';
import { SpinnerService } from './shared/services/spinner.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [
		RouterOutlet,
		AppMaterialModule,
		RouterLink,
		SpinnerComponent,
		AsyncPipe,
	],
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
	destroy$ = new Subject<boolean>();
	events: string[] = [];
	opened = false;
	userStatus: Observable<boolean>;
	isLoading: Observable<boolean>;
	/* eslint-disable  @typescript-eslint/no-explicit-any */
	private logoutTimer: any;
	private readonly timeoutDuration = 8 * 60 * 60 * 1000;
	mobileQuery: MediaQueryList;
	private _mobileQueryListener: () => void;

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
	) {
		const changeDetectorRef = inject(ChangeDetectorRef);
		const media = inject(MediaMatcher);

		this.mobileQuery = media.matchMedia('(max-width: 1800px)');
		this._mobileQueryListener = () => changeDetectorRef.detectChanges();
		this.mobileQuery.addListener(this._mobileQueryListener);
	}

	ngOnInit() {
		this.userStatus = this.authService.userLoginStatus$;
		const loggedIn = localStorage.getItem('loggedIn');
		if (loggedIn) {
			if (this.authService.LoginStatus) {
				this.authService.userLoginStatus.next(true);
			}
			this.isLoading = this.spinnerStatusService.spinnerStatus$;
			this.resetLogoutTimer();
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
		this.opened = false;
	}

	goToProfile() {
		this.router.navigateByUrl('profile');
	}

	ngOnDestroy() {
		this.clearLogoutTimer();
		this.mobileQuery.removeListener(this._mobileQueryListener);
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
