import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {AuthRouterModule} from "./auth.router.module";
import {AuthComponent} from "./auth.component";
import {AppMaterialModule} from "../../app-material/app-material.module";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    AuthComponent
  ],
  imports: [
    AppMaterialModule,
    CommonModule,
    AuthRouterModule,
    ReactiveFormsModule,
    NgOptimizedImage
  ]
})
export class AuthModule {
}
