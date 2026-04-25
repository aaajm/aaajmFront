import {ComponentFixture, TestBed} from '@angular/core/testing';

import {Partner} from './partner';

describe('Partner', () => {
  let component: Partner;
  let fixture: ComponentFixture<Partner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Partner],
    }).compileComponents();

    fixture = TestBed.createComponent(Partner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
