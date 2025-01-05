import { CommonModule, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-singlemovie',
  imports: [CommonModule,NgIf],
  templateUrl: './singlemovie.component.html',
  styleUrl: './singlemovie.component.css'
})
export class SinglemovieComponent implements OnInit {

  movieId!: string; // To store the movie ID from the route
  movieData: any = null; // To store fetched movie details
  errorMessage: string = '';

  private getMovieByIdUrl = 'http://localhost:5000/api/users/getmoviebyid'; 

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    // Subscribe to route parameter changes
    this.route.paramMap.subscribe((params) => {
      const newMovieId = params.get('id')!;
      if (newMovieId && newMovieId !== this.movieId) {
        this.movieId = newMovieId;
        this.fetchMovieDetails(); // Fetch details for the new movie ID
      }
    });
  }

  // Fetch movie details by ID
  fetchMovieDetails() {
    this.http.get<any>(`${this.getMovieByIdUrl}/${this.movieId}`).subscribe({
      next: (data) => {
        this.movieData = data; // Store the fetched movie details
        console.log("movie data:",this.movieData)
      },
      error: (error) => {
        this.errorMessage = 'Failed to load movie details. Please try again.';
      },
    });
  }

  get watchTimeConverted(): string {
    const hours = Math.floor(this.movieData.watchTime / 60);
    const minutes = this.movieData.watchTime % 60;
    return `${hours} hours ${minutes} minutes`;
  }

}
