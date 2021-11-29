import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarRootComponent } from './calendar-root.component';

describe('CalendarRootComponent', () => {
  let component: CalendarRootComponent;
  let fixture: ComponentFixture<CalendarRootComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendarRootComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
