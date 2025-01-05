import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersignupComponent } from './usersignup.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UsersignupComponent', () => {
  let component: UsersignupComponent;
  let fixture: ComponentFixture<UsersignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersignupComponent,HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
