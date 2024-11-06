import { TestBed } from '@angular/core/testing';

import { WebsocketBotService } from './websocket-bot.service';

describe('WebsocketBotService', () => {
	let service: WebsocketBotService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(WebsocketBotService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
