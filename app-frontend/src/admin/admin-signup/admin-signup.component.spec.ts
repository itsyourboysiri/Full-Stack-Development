import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSignupComponent } from './admin-signup.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AdminSignupComponent', () => {
  let component: AdminSignupComponent;
  let fixture: ComponentFixture<AdminSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSignupComponent,HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
