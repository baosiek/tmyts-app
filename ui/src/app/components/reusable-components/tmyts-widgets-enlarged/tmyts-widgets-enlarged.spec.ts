import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmytsWidgetsEnlarged } from './tmyts-widgets-enlarged';

describe('TmytsWidgetsEnlarged', () => {
  let component: TmytsWidgetsEnlarged;
  let fixture: ComponentFixture<TmytsWidgetsEnlarged>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TmytsWidgetsEnlarged]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TmytsWidgetsEnlarged);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
