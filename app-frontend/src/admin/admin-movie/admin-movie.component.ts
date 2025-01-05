

import { CommonModule, NgIf } from '@angular/common';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';

import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-admin-movie',
  imports: [FormsModule, NgIf, CommonModule, HttpClientModule],
  standalone: true,
  templateUrl: './admin-movie.component.html',
  styleUrl: './admin-movie.component.css'
})



export class AdminMovieComponent {

  @ViewChild('movieInsertForm') movieInsertForm!: NgForm; // Access the form
  @Output() movieInserted = new EventEmitter<void>(); // Emit event after insertion
  constructor(private http: HttpClient) { }

  movie = {
    movieName: '',
    category: '',
    releaseYear: null as number | null,
    picture: null,
    cast: '',
    trailerLink: '',
    watchTime: null as number | null,
    director: '',
    nowScreening: '', // "Yes" or "No"
    additionalInfo: '',
    timeSlots: [] as string[],
  };



  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.movie.picture = file;
    }
  }


  addTimeSlot() {
    this.movie.timeSlots.push(''); // Add an empty time slot
  }

  removeTimeSlot(index: number) {
    this.movie.timeSlots.splice(index, 1); // Remove time slot at the specified index
  }

  updateTimeSlot(index: number, value: string) {
    this.movie.timeSlots[index] = value; // Update the specific time slot
  }

  onSubmit() {
    if (this.movie) {
      const insertMovieData = new FormData();
      insertMovieData.append('movieName', this.movie.movieName);
      insertMovieData.append('category', this.movie.category);
      insertMovieData.append('releaseYear', this.movie.releaseYear?.toString() ?? '');
      insertMovieData.append('additionalInfo', this.movie.additionalInfo);
      insertMovieData.append('cast', this.movie.cast || '');
      insertMovieData.append('trailerLink', this.movie.trailerLink || '');
      insertMovieData.append('watchTime', this.movie.watchTime?.toString() ?? '');
      insertMovieData.append('director', this.movie.director || '');
      insertMovieData.append('nowScreening',  this.movie.nowScreening === 'Yes' ? 'true' : 'false' );
      this.movie.timeSlots.forEach((slot, index) =>
        insertMovieData.append(`timeSlots[${index}]`, slot)
      );

      // console.log('movieName', this.movie.movieName)
      // console.log('category', this.movie.category)
      // console.log('releaseYear', this.movie.releaseYear)
      // console.log('additionalInfo', this.movie.additionalInfo)
      // console.log('cast', this.movie.cast)
      // console.log('trailerLink', this.movie.trailerLink)
      // console.log('releaseYear', this.movie.releaseYear)
      // console.log('watchTime', this.movie.watchTime)
      // console.log('director', this.movie.director)
      // console.log('nowScreening', this.movie.nowScreening)

      if (this.movie.picture) {
        insertMovieData.append('picture', this.movie.picture);
        // console.log(this.movie.picture)
      } else {
        console.error('Picture is required');
        // Optionally, you can show a message to the user if the picture is missing
      }

      this.http.post('http://localhost:5000/api/users/movies', insertMovieData).subscribe(
        (response: any) => {
          console.log('Movie inserted successfully:', response);
          alert('Movie inserted successfully!');
          this.movieInserted.emit();
          this.resetForm();
        },
        (error: any) => {
          console.error('Error inserting movie:', error);
          alert('Failed to insert movie. Please try again.');
        }
      );
    }
  }

  resetForm() {
    this.movieInsertForm.resetForm(); // Reset form fields
    this.movie.timeSlots = [];
    const fileInput = document.getElementById('picture') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; // Clear file input
    }
  }
}
