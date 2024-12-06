import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './shared/guards/auth.guard';
import { homeResolver } from './pages/home/home.resolver';
import { gamesResolver } from './pages/games/games.resolver';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { errorPageGuard } from './shared/guards/error-page.guard';
import { NotInternetConectionComponent } from './pages/not-internet-conection/not-internet-conection.component';
import { profileResolver } from './pages/profile/profile.resolver';

export const routes: Routes = [
	{
		path: '',
		loadChildren: () =>
			import('./pages/auth/auth.module').then(m => m.AuthModule),
		title: 'Auth',
    canActivate: [authGuard],
	},
	{
		path: 'home',
		component: HomeComponent,
		title: 'Home',
		canActivate: [authGuard],
		resolve: { games: homeResolver },
	},
	{
		path: 'games',
		loadChildren: () =>
			import('./pages/games/games.module').then(m => m.GamesModule),
		title: 'Games',
		canActivate: [authGuard],
		resolve: { games: gamesResolver },
	},
	{
		path: 'profile',
		loadChildren: () =>
			import('./pages/profile/profile.module').then(m => m.ProfileModule),
		title: 'Profile',
		canActivate: [authGuard],
    resolve: { user: profileResolver },
	},
	{
		path: 'error',
		component: ErrorPageComponent,
		title: 'Error',
		canActivate: [authGuard, errorPageGuard],
	},
	{
		path: 'no-internet-connection',
		component: NotInternetConectionComponent,
		title: 'NoInternetConnection',
		canActivate: [authGuard, errorPageGuard],
	},
];
