import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GamesComponent} from "./games.component";
import {AppMaterialModule} from "../../app-material/app-material.module";
import {NgxPaginationModule} from "ngx-pagination";
import {GamesCardsComponent} from "../../shared/components/games-cards/games-cards.component";
import {GamesFilterComponent} from "./containers/games-filter/games-filter.component";
import {ReactiveFormsModule} from "@angular/forms";
import {GamesRoutingModule} from "./games.router.module";
import {SpinnerComponent} from "../../shared/components/spinner/spinner.component";


@NgModule({
  declarations: [GamesComponent, GamesFilterComponent],
  imports: [
    CommonModule,
    AppMaterialModule,
    NgxPaginationModule,
    GamesCardsComponent,
    ReactiveFormsModule,
    GamesRoutingModule,
    SpinnerComponent
  ]
})
export class GamesModule {
}
