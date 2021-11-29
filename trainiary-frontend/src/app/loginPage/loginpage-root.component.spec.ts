import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginpageRootComponent } from './loginpage-root.component';

describe('LoginpageRootComponent', () => {
  let component: LoginpageRootComponent;
  let fixture: ComponentFixture<LoginpageRootComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginpageRootComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginpageRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
