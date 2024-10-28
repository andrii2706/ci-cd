import { TestBed } from '@angular/core/testing';

import { GamesVideosService } from './games-videos.service';

xdescribe('GamesVideosService', () => {
	let service: GamesVideosService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(GamesVideosService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
