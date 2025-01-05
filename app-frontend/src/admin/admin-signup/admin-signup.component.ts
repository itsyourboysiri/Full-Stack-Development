import { CommonModule, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';

@Component({
  selector: 'app-admin-signup',
  standalone:true,
  imports: [FormsModule,NgIf,CommonModule],
  templateUrl: './admin-signup.component.html',
  styleUrl: './admin-signup.component.css',
  
})
export class AdminSignupComponent {

  adminUser = {
    adminusername: '',
    adminpassword: '',
    adminemail: ''
  };
  errorMessage: string = '';

  constructor(private http: HttpClient) { }

  
  validateAdminUsername(adminusername: string): boolean {
    const usernamePattern = /^[a-zA-Z0-9_]+$/; // Only letters, numbers, and underscores
    return usernamePattern.test(adminusername);
  }


  validateAdminPassword(adminpassword: string): boolean {
    const passwordPattern = /^\S+$/; // No spaces allowed
    return passwordPattern.test(adminpassword) && adminpassword.length >= 5; // At least 5 characters
  }

 
  validateAdminEmail(adminemail: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Valid email pattern
    return emailPattern.test(adminemail);
  }

  Onsubmit(): void {
    // Reset error message on each submit
    this.errorMessage = '';

    // Validate username, password, and email before submitting
    if (!this.validateAdminUsername(this.adminUser.adminusername)) {
      this.errorMessage = 'Admin username must consist of letters, numbers, and underscores only, with no spaces or special characters.';
      return;
    }

    if (!this.validateAdminPassword(this.adminUser.adminpassword)) {
      this.errorMessage = 'Admin password must be at least 5 characters long and cannot contain spaces.';
      return;
    }

    if (!this.validateAdminEmail(this.adminUser.adminemail)) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    console.log('Admin form Submitted');
    console.log('Username:', this.adminUser.adminusername);
    console.log('Password:', this.adminUser.adminpassword);
    console.log('Email:', this.adminUser.adminemail);

    // Pass the data to the backend through the service
    const AdminsignupData = {
      adminUsername: this.adminUser.adminusername,
      adminPassword: this.adminUser.adminpassword,
      adminEmail: this.adminUser.adminemail,
    };
  
    this.http.post('http://localhost:5000/api/admin/signup', AdminsignupData).subscribe(
      (response: any) => {
        console.log('Admin signed up successfully:', response);
        
        
      },
      (error: any) => {
        console.error('Error signing up user:', error);
        this.errorMessage = 'There was an error while signing up. Please try again later.';
      }
    );
  }
}
