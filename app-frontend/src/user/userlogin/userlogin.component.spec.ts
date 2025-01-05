import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserloginComponent } from './userlogin.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UserloginComponent', () => {
  let component: UserloginComponent;
  let fixture: ComponentFixture<UserloginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserloginComponent,HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
