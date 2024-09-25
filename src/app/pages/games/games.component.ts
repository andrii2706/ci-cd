import {ChangeDetectorRef, Component} from '@angular/core';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrl: './games.component.scss'
})
export class GamesComponent {
  constructor(private cdr: ChangeDetectorRef) {
  }
}
