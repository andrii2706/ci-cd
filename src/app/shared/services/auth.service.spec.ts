import {TestBed} from '@angular/core/testing';

import {AuthService} from './auth.service';
import {environment} from "../../../environment/environment";
import {AngularFireModule} from "@angular/fire/compat";
//TODO write unit test

xdescribe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebaseConfig)
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
