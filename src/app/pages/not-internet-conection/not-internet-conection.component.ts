import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-not-internet-conection',
  standalone: true,
	imports: [
		MatButton,
	],
  templateUrl: './not-internet-conection.component.html',
  styleUrl: './not-internet-conection.component.scss'
})
export class NotInternetConectionComponent {
  redirectToPreviousPage() {
    history.back();
  }
}
