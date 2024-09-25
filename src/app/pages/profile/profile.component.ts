import {ChangeDetectorRef, Component} from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  constructor(private cdr: ChangeDetectorRef) {
  }
}
