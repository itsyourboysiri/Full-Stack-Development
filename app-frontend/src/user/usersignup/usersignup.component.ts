import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; 
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-usersignup',
  standalone: true,
  imports: [FormsModule,HttpClientModule,NgIf,CommonModule],
  providers: [], 
  templateUrl: './usersignup.component.html',
  styleUrls: ['./usersignup.component.css']
})
export class UsersignupComponent {
  @Input() isVisible: boolean = false; // Controls visibility of the modal
  @Output() closeModal = new EventEmitter<void>(); // Event to notify parent


  user = {
    clientusername: '',
    clientpassword: '',
    clientemail: ''
  };

  errorMessage: string = ''; // To display error messages

  constructor( private router: Router,private http: HttpClient) {}

  // Function to validate username
  validateUsername(username: string): boolean {
    const usernamePattern = /^[a-zA-Z0-9_]+$/; // Only letters, numbers, and underscores
    return usernamePattern.test(username);
  }

   // Function to validate password
   validatePassword(password: string): boolean {
    const passwordPattern = /^\S+$/; // No spaces allowed
    return passwordPattern.test(password) && password.length >= 5; // At least 5 characters
  }

    // Function to validate email
    validateEmail(email: string): boolean {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Valid email pattern
      return emailPattern.test(email);
    }

  onSubmit(): void {

     // Reset error message on each submit
     this.errorMessage = '';

     // Validate username, password, and email before submitting
     if (!this.validateUsername(this.user.clientusername)) {
       this.errorMessage = 'Username must consist of letters, numbers, and underscores only, with no spaces or special characters.';
       return;
     }
 
     if (!this.validatePassword(this.user.clientpassword)) {
       this.errorMessage = 'Password must be at least 5 characters long and cannot contain spaces.';
       return;
     }
 
     if (!this.validateEmail(this.user.clientemail)) {
       this.errorMessage = 'Please enter a valid email address.';
       return;
     }

    console.log('Form Submitted');
    console.log('Username:', this.user.clientusername);
    console.log('Password:', this.user.clientpassword);
    console.log('Email:', this.user.clientemail);
  
    // Pass the data to the backend through the service
    const signupData = {
      username: this.user.clientusername,
      password: this.user.clientpassword,
      email: this.user.clientemail,
    };
  
    this.http.post('http://localhost:5000/api/users/signup', signupData).subscribe(
      (response: any) => {
        console.log('User signed up successfully:', response);
        alert("Signup successful! Welcome ${this.user.clientusername} to the CineBooking.")
       
        this.router.navigate(['/userlogin']);
      },
      (error: any) => {
        console.error('Error signing up user:', error);
        this.errorMessage = 'There was an error while signing up. Please try again later.';
      }
    );
    }
    
    resetSignUpForm(){
      this.user.clientusername='';
      this.user.clientpassword='';
      this.user.clientemail='';
    }


    close() {
      this.closeModal.emit(); // Notify parent to hide the modal
      this.resetSignUpForm();
    }
  
}
