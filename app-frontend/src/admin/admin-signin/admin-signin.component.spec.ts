import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSigninComponent } from './admin-signin.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AdminSigninComponent', () => {
  let component: AdminSigninComponent;
  let fixture: ComponentFixture<AdminSigninComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSigninComponent,HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
