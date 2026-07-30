import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessingStatus } from './processing-status';

describe('ProcessingStatus', () => {
  let component: ProcessingStatus;
  let fixture: ComponentFixture<ProcessingStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessingStatus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessingStatus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
