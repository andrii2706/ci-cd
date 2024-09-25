import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GamesComponent} from "./games.component";
import {AppMaterialModule} from "../../app-material/app-material.module";



@NgModule({
  declarations: [GamesComponent],
  imports: [
    CommonModule,
    AppMaterialModule,
  ]
})
export class GamesModule { }
