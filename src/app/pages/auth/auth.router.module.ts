import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {AuthComponent} from "./auth.component";


let routes: Routes = [
  {
    path: '',
    component: AuthComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRouterModule {
}
