import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './shared/guards/auth.guard';
import { homeResolver } from './pages/home/home.resolver';
import { gamesResolver } from './pages/games/games.resolver';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { errorPageGuard } from './shared/guards/error-page.guard';
import { NotInternetConectionComponent } from './pages/not-internet-conection/not-internet-conection.component';

export const routes: Routes = [
	{
		path: '',
		loadChildren: () =>
			import('./pages/auth/auth.module').then(m => m.AuthModule),
		title: 'Auth',
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
	},
	{
		path: 'error',
		component: ErrorPageComponent,
		title: 'Error',
		canActivate: [authGuard, errorPageGuard],
		canDeactivate: [],
	},
	{
		path: 'no-internet-connection',
		component: NotInternetConectionComponent,
		title: 'NoInternetConnection',
		canActivate: [authGuard, errorPageGuard],
	},
];
