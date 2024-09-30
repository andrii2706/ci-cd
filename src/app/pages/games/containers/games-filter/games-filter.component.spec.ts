import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GamesFilrerComponent} from './games-filter.component';

describe('GamesFilrerComponent', () => {
  let component: GamesFilrerComponent;
  let fixture: ComponentFixture<GamesFilrerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamesFilrerComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GamesFilrerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
