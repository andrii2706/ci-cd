import { Routes } from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";


export const routes: Routes = [
  {path: '', loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule), title: 'Auth'},
  {path: 'home', component: HomeComponent, title: 'Home'},
  {path: 'games', loadChildren: () => import('./pages/games/games.module').then(m => m.GamesModule), title: 'Games'},
  {path: 'profile', loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule), title: 'Profile'},
];
