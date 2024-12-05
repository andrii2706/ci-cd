import { Component, inject, model } from '@angular/core';
import { AppMaterialModule } from '../../../app-material/app-material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-confirmation',
	standalone: true,
	imports: [AppMaterialModule],
	templateUrl: './confirmation.component.html',
	styleUrl: './confirmation.component.scss',
})
export class ConfirmationComponent {
	dialogRef = inject(MatDialogRef<ConfirmationComponent>);
	data = inject<{ confirm: boolean }>(MAT_DIALOG_DATA);
	confirmStatus = model(this.data.confirm);

	statusOfDeleteGame(status: boolean) {
		this.dialogRef.close(status);
	}
}
