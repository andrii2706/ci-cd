import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamesComponent } from './games.component';
import { GamesDetailsComponent } from '../../shared/components/games-details/games-details.component';

const routes: Routes = [
  {
    path: '',
    component: GamesComponent,
  },
  {
    path: ':id',
    component: GamesDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GamesRoutingModule {}
