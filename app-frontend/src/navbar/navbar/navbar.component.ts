import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, NgModule, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserloginComponent } from '../user/userlogin/userlogin.component';
import { UsersignupComponent } from '../user/usersignup/usersignup.component';
import { SessionService } from '../services/session.service';
@Component({
  selector: 'app-navbar',
  imports: [FormsModule,NgIf,NgFor,UserloginComponent,UsersignupComponent],
  standalone:true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  searchQuery: string = '';
  movies: any[] = [];
  filteredMovies: any[] = []; 
  errorMessage: string = '';
  private searchMoviesUrl = 'http://localhost:5000/api/users/searchmovies'; 
  dropdownWidth: number = 0;

  private logoutUrl = 'http://localhost:5000/api/users/logout';

  @ViewChild('searchBar') searchBar!: ElementRef;

  showDropdown: boolean = false; // Track dropdown visibility


  constructor(private http: HttpClient, private router: Router,private sessionService: SessionService ) {}

  isLoginModalVisible: boolean = false; // Track modal visibility
  isSignupModalVisible: boolean = false;

  isLoggedIn: boolean = false; // Track user login state
  ngOnInit(): void {
    // Check session on component initialization
    const session = this.sessionService.getSession();
    if (session) {
      this.isLoggedIn = true;
    }
  }
  
  toggleLoginModal() {
    if (this.isLoggedIn) {
      // If logged in, clicking login button logs the user out
      this.logout();
    } else {
      // Otherwise, show login modal
      this.isLoginModalVisible = true;
    }
  }

  closeLoginModal() {
    this.isLoginModalVisible = false;
  }
  openSignupModal() {
    this.isSignupModalVisible = true;
  }

  closeSignupModal() {
    this.isSignupModalVisible = false;
  }

  onLoginSuccess() {
    // Handle post-login logic
    this.isLoggedIn = true;
    this.closeLoginModal();
  }

  logout() {

    const session = this.sessionService.getSession(); // Get session data from SessionService
    const sessionId = session ? session.sessionId : null; // Extract session ID from session data
    
    if (sessionId) {
      // Call the backend logout endpoint with sessionId
      this.http.post(this.logoutUrl, { sessionId }).subscribe({
        next: (response) => {
          console.log('Logout response:', response); 
          this.isLoggedIn = false; // Update frontend state
          this.sessionService.clearSession(); // Clear session from localStorage
          window.location.reload();
          
          alert('You have successfully logged out.');
          // Optionally redirect user to the home page
          // this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error logging out:', error);
          alert('Error logging out.');
        }
      });
    } else {
      console.error('No session found for logout');
      alert('Error: No session found.');
    }
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.http
        .get<any[]>(`${this.searchMoviesUrl}`, { params: { name: this.searchQuery } })
        .subscribe({
          next: (response) => {
            console.log('API Response:', response); // Log API response
            this.filteredMovies = response
              .filter((movie) =>
                movie.movieName.toLowerCase().startsWith(this.searchQuery.toLowerCase())
              )
              .concat(
                response.filter(
                  (movie) =>
                    !movie.movieName.toLowerCase().startsWith(this.searchQuery.toLowerCase())
                )

              );
              this.showDropdown = true; // Show dropdown when search is successful

            console.log('Filtered Movies:', this.filteredMovies); // Log filtered results
          },
          error: (error) => {
            console.error('Error fetching movies:', error);
          },
        });
    } else {
      this.filteredMovies = []; // Clear dropdown if search query is empty
      this.showDropdown = false; // Hide dropdown if search query is empty
    }
  }
  onMovieClick(movieid: string) {
    console.log('Selected movie:', movieid);
    // Navigate to the single movie page with the movie ID
    this.router.navigate(['/singlemovie', movieid]);
  }

  @HostListener('document:click', ['$event'])
  onInputFocusOut(event: FocusEvent) {
    const target = event.relatedTarget as HTMLElement;
    const isInsideDropdown = !!target?.closest('.dropdown-menu');

    if (!isInsideDropdown) {
        this.showDropdown = false;
    }
}
  onFocus() {
    if (this.searchQuery.trim() && this.filteredMovies.length > 0) {
      this.showDropdown = true; // Show dropdown on focus if search query exists
    }
  }

  
}
