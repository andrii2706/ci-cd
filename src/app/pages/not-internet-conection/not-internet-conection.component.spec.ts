import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotInternetConectionComponent } from './not-internet-conection.component';

describe('NotInternetConectionComponent', () => {
	let component: NotInternetConectionComponent;
	let fixture: ComponentFixture<NotInternetConectionComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [NotInternetConectionComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(NotInternetConectionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
