import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfileRouterModule} from "./profile.router.module";
import {ProfileComponent} from "./profile.component";
import {AppMaterialModule} from "../../app-material/app-material.module";
import {SpinnerComponent} from "../../shared/components/spinner/spinner.component";
import {ReplaceNullImgPipe} from "../../shared/pipe/replace-null-img.pipe";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [ProfileComponent],
    imports: [
        ProfileRouterModule,
        AppMaterialModule,
        CommonModule,
        SpinnerComponent,
        ReplaceNullImgPipe,
        ReactiveFormsModule
    ]
})
export class ProfileModule {
}
