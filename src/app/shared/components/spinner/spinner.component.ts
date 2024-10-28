import { Component } from '@angular/core';
import { AppMaterialModule } from '../../../app-material/app-material.module';

@Component({
	selector: 'app-spinner',
	standalone: true,
	imports: [AppMaterialModule],
	templateUrl: './spinner.component.html',
	styleUrl: './spinner.component.scss',
})
export class SpinnerComponent {}
