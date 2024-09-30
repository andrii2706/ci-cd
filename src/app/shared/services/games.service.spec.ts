import {TestBed} from '@angular/core/testing';

import {GamesService} from './games.service';
import {HttpClient, HttpHandler} from "@angular/common/http";
import {AngularFireModule} from "@angular/fire/compat";
import {environment} from "../../../environment/environment";
//TODO write unit test

xdescribe('GamesService', () => {
  let service: GamesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebaseConfig)
      ],
      providers:[HttpClient, HttpHandler]
    });
    service = TestBed.inject(GamesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
