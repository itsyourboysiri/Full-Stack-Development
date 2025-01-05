import { CommonModule, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminMovieComponent } from '../admin-movie/admin-movie.component';
import { AdminDashboardUpdatemovieComponent } from '../admin-dashboard-updatemovie/admin-dashboard-updatemovie.component';


@Component({
  selector: 'app-admin-dashboard-movie',
  imports: [CommonModule,NgIf,FormsModule,AdminMovieComponent,AdminDashboardUpdatemovieComponent],
  standalone:true,
  templateUrl: './admin-dashboard-movie.component.html',
  styleUrl: './admin-dashboard-movie.component.css'
})
export class AdminDashboardMovieComponent {
 

  movies: any[] = []; // Store retrieved movies
  private retrievedMovieUrl = 'http://localhost:5000/api/users/getmovies'; 
  private searchMoviesUrl = 'http://localhost:5000/api/users/searchmovies'; 
  private deleteMovieUrl = 'http://localhost:5000/api/users/deletemovie';

  
  searchQuery: string = '';
  errorMessage: string = '';
  movieToDeleteId: string = '';
  movieToUpdate: any = null;
  movieToUpdateId: string = '';

  isFormVisible: boolean = false;
  isUpdateFormVisible: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchMovies();
  }

  fetchMovies() {
    console.log('Fetching movies from backend...');
    this.http.get<any[]>(this.retrievedMovieUrl).subscribe({
      next: (data) => {
        this.movies = data;
        console.log('Movies retrieved:', this.movies);
      },
      error: (err) => {
        console.error('Error fetching movies:', err);
      },
    });
  }

  

  toggleForm() {
    this.isFormVisible = !this.isFormVisible; // Toggle form visibility
  }

  handleMovieInserted() {
    this.fetchMovies(); // Refresh movies after a successful insertion
    this.isFormVisible = false; // Close the form
  }

  searchMovies(){
    if (this.searchQuery.trim()) {
      this.http
        .get<any[]>(`${this.searchMoviesUrl}`, { params: { name: this.searchQuery } })
        .subscribe({
          next: (movies) => {
            this.movies = movies;
            console.log('Movies found:', this.movies);
          },
          error: (error) => {
            console.error('Error searching movies:', error);
            this.errorMessage = 'Failed to fetch movies.';
          },
        });
    } else {
      console.warn('Search query is empty.');
      this.errorMessage = 'Please enter a movie name to search.';
    }
  }

  confirmDelete(_id: string) {
    this.movieToDeleteId = _id;
  }

  cancelDelete() {
    this.movieToDeleteId = '';
  }
  
   // Send delete request to backend
   deleteMovie(_id: string) {
    this.http.delete(`${this.deleteMovieUrl}/${_id}`).subscribe({
      next: () => {
        console.log(`Movie with ID ${_id} deleted successfully.`);
        this.fetchMovies(); // Refresh the movie list
        this.movieToDeleteId = ''; // Clear the ID after successful deletion
      },
      error: (err) => console.error('Error deleting movie:', err),
    });
  }

  openUpdateForm(movieId: string) {
    this.movieToUpdateId = movieId; // Pass only the movie ID
    this.isUpdateFormVisible = true; // Show the update form
  }

  // Close the update form
  closeUpdateForm() {
    this.isUpdateFormVisible = false;
    this.movieToUpdate = null;
    this.fetchMovies(); // Refresh the movie list
  }

  
}
