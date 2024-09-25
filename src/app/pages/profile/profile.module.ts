import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProfileRouterModule} from "./profile.router.module";
import {ProfileComponent} from "./profile.component";
import {AppMaterialModule} from "../../app-material/app-material.module";



@NgModule({
  declarations: [ProfileComponent],
  imports: [
    ProfileRouterModule,
    AppMaterialModule,
    CommonModule
  ]
})
export class ProfileModule { }
