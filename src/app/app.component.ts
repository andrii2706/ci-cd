import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MatCheckbox} from "@angular/material/checkbox";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {FormsModule} from "@angular/forms";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatToolbar} from "@angular/material/toolbar";
import {MatListItem, MatNavList} from "@angular/material/list";
import {MatTooltip} from "@angular/material/tooltip";
import {MatLine} from "@angular/material/core";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatCheckbox, MatSidenavContent, MatSidenav, MatSidenavContainer, FormsModule, MatButton, MatIcon, MatIconButton, MatToolbar, MatNavList, MatListItem, MatTooltip, RouterLink, MatLine],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ci-cd-test-project';
  constructor() {
  }
  events: string[] = [];
  opened: boolean = false;
}
