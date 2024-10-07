import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {AppMaterialModule} from "./app-material/app-material.module";
import {AuthService} from "./shared/services/auth.service";
import {noop} from "rxjs";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AppMaterialModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'] // змінив на 'styleUrls' (зверни увагу на помилку в 'styleUrl')
})
export class AppComponent implements OnInit {

  events: string[] = [];
  opened = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    if (this.authService.LoginStatus) { // Перевірка логіну
      this.authService.userLoginStatus.next(true); // Оновлюємо статус логіну
    }
  }

  logoutUser() {
    this.authService.logout().then(() => noop()); // Виклик логауту
  }

  goToProfile() {
    this.router.navigateByUrl('profile'); // Навігація до профілю
  }
}
