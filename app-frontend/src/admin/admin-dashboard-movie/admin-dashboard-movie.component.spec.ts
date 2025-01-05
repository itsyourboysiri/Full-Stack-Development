import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardMovieComponent } from './admin-dashboard-movie.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AdminDashboardMovieComponent', () => {
  let component: AdminDashboardMovieComponent;
  let fixture: ComponentFixture<AdminDashboardMovieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardMovieComponent,HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardMovieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
