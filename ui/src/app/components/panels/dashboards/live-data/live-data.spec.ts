import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveData } from './live-data';

describe('LiveData', () => {
  let component: LiveData;
  let fixture: ComponentFixture<LiveData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveData]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveData);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
