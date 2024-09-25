import {ChangeDetectorRef, Component} from '@angular/core';
import {AppMaterialModule} from "../../app-material/app-material.module";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AppMaterialModule,],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(private cdr: ChangeDetectorRef) {
  }
}
