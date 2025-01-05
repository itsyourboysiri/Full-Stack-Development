import { CommonModule, NgFor } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-movies',
  imports: [NgFor,CommonModule,HttpClientModule],
  templateUrl: './movies.component.html',
  standalone:true,
  styleUrl: './movies.component.css'
})
export class MoviesComponent {

  movies: any[] = [];

  constructor(private http: HttpClient,private router: Router) {}

  ngOnInit(): void {
    this.fetchMovies();
  }

  fetchMovies(): void {
    const retrieveMovieUrl = 'http://localhost:5000/api/users/getmovies';  

    this.http.get<any[]>(retrieveMovieUrl).subscribe(
      (data) => {
        // console.log('Movies:', data);
        this.movies = data;
      },
      (error) => {
        console.error('Error fetching movies', error);
      }
    );
  }

  onCardClick(movie: any) {
    console.log('Movie clicked:', movie);
    // Perform any action, e.g., navigate to a movie details page:
    // this.router.navigate(['/movie-details', movie._id]);
  }

  onBookNow(movie: any) {
    console.log('Book Now clicked for:', movie);
    // Navigate to booking page or perform any action
    // this.router.navigate(['/book-now', movie._id]);
  }

  navigateToSingleMovie(movieId: string) {
   
    this.router.navigate(['/singlemovie', movieId]);
    console.log("movie id from movies:",movieId)
  }
  

}
