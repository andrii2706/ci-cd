import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationComponent } from './confirmation.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppMaterialModule } from '../../../app-material/app-material.module';

describe('ConfirmationComponent', () => {
	let component: ConfirmationComponent;
	let fixture: ComponentFixture<ConfirmationComponent>;
	let mockDialogRef: jest.Mocked<MatDialogRef<ConfirmationComponent>>;

	beforeEach(async () => {
		mockDialogRef = {
			close: jest.fn(),
		} as unknown as jest.Mocked<MatDialogRef<ConfirmationComponent>>;

		await TestBed.configureTestingModule({
			imports: [ConfirmationComponent, AppMaterialModule],
			providers: [
				{ provide: MatDialogRef, useValue: mockDialogRef },
				{ provide: MAT_DIALOG_DATA, useValue: { confirm: false } },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(ConfirmationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should inject the data', () => {
		expect(component.data).toEqual({ confirm: false });
		expect(component.data.confirm).toBe(false);
	});
});
