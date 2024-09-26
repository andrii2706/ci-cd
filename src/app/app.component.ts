import { Component } from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {AppMaterialModule} from "./app-material/app-material.module";
import {AuthService} from "./shared/services/auth.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AppMaterialModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private router: Router) {
  }
  events: string[] = [];
  opened: boolean = false;

  goToProfile() {
    this.router.navigateByUrl('profile');
  }

}
