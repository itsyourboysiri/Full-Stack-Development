import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-admin-signin',
  standalone: true,
   imports: [FormsModule,NgIf,CommonModule],
  templateUrl: './admin-signin.component.html',
  styleUrls: ['./admin-signin.component.css'],
})
export class AdminSigninComponent {
  adminusername: string = '';
  adminpassword: string = '';
  errorMessage: string = '';

  constructor(
    private http: HttpClient, // Inject HttpClient to make HTTP requests
    private router: Router
  ) {}

  // Function to validate username
  validateUsername(username: string): boolean {
    const usernamePattern = /^[a-zA-Z0-9_]+$/; // Only letters, numbers, and underscores, no spaces
    return usernamePattern.test(username);
  }

  // Function to validate password
  validatePassword(password: string): boolean {
    const passwordPattern = /^\S+$/; // No spaces allowed
    return passwordPattern.test(password) && password.length >= 5; // At least 5 characters
  }

  onSubmit(): void {
    // Reset error message on each submit
    this.errorMessage = '';

    // Validate username and password
    if (!this.adminusername || !this.adminpassword) {
      this.errorMessage = 'Username and password are required.';
      return;
    }

    if (!this.validateUsername(this.adminusername)) {
      this.errorMessage = 'Username can only contain letters, numbers, and underscores. No spaces allowed.';
      return;
    }

    if (!this.validatePassword(this.adminpassword)) {
      this.errorMessage = 'Password must be at least 5 characters long and cannot contain spaces.';
      return;
    }

    // Prepare login data to send to the backend
    const loginData = {
      adminUsername: this.adminusername,
      adminPassword: this.adminpassword,
    };

    // Make HTTP POST request to the backend API route
    this.http.post('http://localhost:5000/api/admin/login', loginData).subscribe(
      (response: any) => {
        if (response.success) {
          console.log('Login successful:', response.message);
          // Redirect to the admin dashboard or another page after successful login
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.errorMessage = response.message || 'Invalid credentials.';
        }
      },
      (error) => {
        console.error('Login error:', error);
        this.errorMessage = 'An error occurred while trying to log in. Please try again.';
      }
    );
  }
}
