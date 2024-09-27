import { TestBed } from '@angular/core/testing';

import { GamesService } from './games.service';
//TODO write unit test

xdescribe('GamesService', () => {
  let service: GamesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GamesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
