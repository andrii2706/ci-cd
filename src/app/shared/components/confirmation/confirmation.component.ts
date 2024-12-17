import { Component, inject, model } from '@angular/core';
import { AppMaterialModule } from '../../../app-material/app-material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-confirmation',
	standalone: true,
	imports: [AppMaterialModule],
	templateUrl: './confirmation.component.html',
	styleUrls: ['./confirmation.component.scss', '../../styles/shared.scss'],
})
export class ConfirmationComponent {
	data = inject<{ confirm: boolean }>(MAT_DIALOG_DATA);
	confirmStatus = model(this.data.confirm);

	constructor(public dialogRef: MatDialogRef<ConfirmationComponent>) {}

	statusOfDeleteGame(status: boolean) {
		this.dialogRef.close(status);
	}
}
