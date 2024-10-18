import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { gamesResolver } from './games.resolver';

describe('gamesResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => gamesResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
