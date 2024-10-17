import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterOutlet} from '@angular/router';
import {AppMaterialModule} from "./app-material/app-material.module";
import {AuthService} from "./shared/services/auth.service";
import {filter, noop} from "rxjs";

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

  constructor(private router: Router, private authService: AuthService) {
  }

  ngOnInit() {
    if (this.authService.LoginStatus) {
      this.authService.userLoginStatus.next(true);
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event: any) => {
          if(event.url === '/'){
            this.router.navigate(['home'])
          }
        });
    }
  }

  logoutUser() {
    this.authService.logout().then(() => noop());
  }
  goToProfile() {
    this.router.navigateByUrl('profile');
  }
}
