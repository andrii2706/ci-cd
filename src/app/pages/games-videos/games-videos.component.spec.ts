import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesVideosComponent } from './games-videos.component';

xdescribe('GamesVideosComponent', () => {
	let component: GamesVideosComponent;
	let fixture: ComponentFixture<GamesVideosComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [GamesVideosComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(GamesVideosComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
