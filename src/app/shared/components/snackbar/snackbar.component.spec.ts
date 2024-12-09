import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SnackbarComponent } from './snackbar.component';
import {
	MAT_SNACK_BAR_DATA,
	MatSnackBarRef,
} from '@angular/material/snack-bar';
import { AppMaterialModule } from '../../../app-material/app-material.module';

describe('SnackbarComponent', () => {
	let component: SnackbarComponent;
	let fixture: ComponentFixture<SnackbarComponent>;
	let mockSnackBarRef: jest.Mocked<MatSnackBarRef<SnackbarComponent>>;

	beforeEach(async () => {
		mockSnackBarRef = {
			_open: jest.fn(),
			dismiss: jest.fn(),
		} as unknown as jest.Mocked<MatSnackBarRef<SnackbarComponent>>;

		await TestBed.configureTestingModule({
			imports: [SnackbarComponent, AppMaterialModule],
			providers: [
				{
					provide: MAT_SNACK_BAR_DATA,
					useValue: { text: 'Test Snackbar', status: 'success' },
				},
				{ provide: MatSnackBarRef, useValue: mockSnackBarRef },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(SnackbarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create the SnackbarComponent', () => {
		expect(component).toBeTruthy();
	});

	it('should inject the MAT_SNACK_BAR_DATA and set dataSnackbar', () => {
		expect(component.dataSnackbar).toBe('Test Snackbar');
		expect(component.data.status).toBe('success');
	});

	it('should call _open method of MatSnackBarRef on ngOnInit', () => {
		component.ngOnInit();
		expect(mockSnackBarRef._open).toHaveBeenCalled();
	});

	it('should set dataSnackbar on initialization', () => {
		component.ngOnInit();
		expect(component.dataSnackbar).toBe('Test Snackbar');
	});
});
