import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationComponent } from './confirmation.component';
//TODO write unit test
xdescribe('ConfirmationComponent', () => {
	let component: ConfirmationComponent;
	let fixture: ComponentFixture<ConfirmationComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ConfirmationComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ConfirmationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
