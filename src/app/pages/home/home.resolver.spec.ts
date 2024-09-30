import {TestBed} from '@angular/core/testing';
import {ResolveFn} from '@angular/router';

import {homeResolver} from './home.resolver';
//TODO write unit test

xdescribe('homeResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => homeResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
