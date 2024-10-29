import { Component } from '@angular/core';
import { AppMaterialModule } from '../../app-material/app-material.module';

@Component({
	selector: 'app-error-page',
	standalone: true,
	imports: [AppMaterialModule],
	templateUrl: './error-page.component.html',
	styleUrl: './error-page.component.scss',
})
export class ErrorPageComponent {

  redirectToPreviousPage() {
    history.back();
  }
}
