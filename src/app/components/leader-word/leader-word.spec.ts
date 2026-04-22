import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LeaderWord} from './leader-word';

describe('LeaderWord', () => {
  let component: LeaderWord;
  let fixture: ComponentFixture<LeaderWord>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaderWord],
    }).compileComponents();

    fixture = TestBed.createComponent(LeaderWord);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
