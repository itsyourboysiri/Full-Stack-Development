import { CommonModule, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, NgModule, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard-updatemovie',
  standalone:true,
  imports: [FormsModule,CommonModule,NgIf],
  templateUrl: './admin-dashboard-updatemovie.component.html',
  styleUrl: './admin-dashboard-updatemovie.component.css'
})
export class AdminDashboardUpdatemovieComponent {

  @ViewChild('movieUpdateForm') movieUpdateForm!: NgForm;

  currentYear = new Date().getFullYear(); // Max year for releaseYear validation
  @Input() movie: any = [];
  @Output() close = new EventEmitter<void>(); // Emit event to close the form

  @Input() movieId!: string;
  private getMovieUrl = 'http://localhost:5000/api/users/getmoviebyid'; // Backend URL to fetch a movie
  private updateMovieUrl = 'http://localhost:5000/api/users/updatemovie'; // Backend URL to update a movie

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchMovieDetails();
  }

 // Fetch the existing movie details by ID
 fetchMovieDetails() {
  console.log('Fetching movie details for ID:', this.movieId);
  this.http.get<any>(`${this.getMovieUrl}/${this.movieId}`).subscribe({
    next: (data) => {
      this.movie = { ...data,
        nowScreening: data.nowScreening ? 'Yes' : 'No',
        timeSlots: data.timeSlots || [],
      }; 
      console.log('Fetched movie data:', JSON.stringify(this.movie, null, 2));
    },
    error: (err) => {
      console.error('Error fetching movie details:', err);
    },
  });
}

  // Handle file input for the movie picture
  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this.movie.pictureFile = file;
      this.movie.picturePreview = URL.createObjectURL(file);
      this.movie.picture = input.files[0];
      console.log('Selected file:', file);
    }
  }

    // Add a new time slot
    addTimeSlot() {
      this.movie.timeSlots.push(''); // Add an empty time slot
    }
  
    // Remove a time slot
    removeTimeSlot(index: number) {
      this.movie.timeSlots.splice(index, 1);
    }
  
  // Submit updated movie data to the backend
  onSubmit() {
    if (this.movieUpdateForm.invalid || this.movie.timeSlots.length === 0) {
      // Mark all fields as touched to show validation errors
      this.movieUpdateForm.form.markAllAsTouched();
      alert('Please fill in all required fields before submitting.');
      return; // Prevent form submission
    }
    const UpdateFormData = new FormData();
    UpdateFormData.append('movieName', this.movie.movieName);
    UpdateFormData.append('category', this.movie.category);
    UpdateFormData.append('releaseYear', this.movie.releaseYear);
    UpdateFormData.append('additionalInfo', this.movie.additionalInfo);
    UpdateFormData.append('cast', this.movie.cast);
    UpdateFormData.append('trailerLink', this.movie.trailerLink);
    UpdateFormData.append('watchTime', this.movie.watchTime?.toString() ?? '');
    UpdateFormData.append('director', this.movie.director || '');
    UpdateFormData.append('nowScreening',  this.movie.nowScreening === 'Yes' ? 'true' : 'false' );

     // Append time slots
     this.movie.timeSlots.forEach((slot: string | Blob, index: any) =>
      UpdateFormData.append(`timeSlots[${index}]`, slot)
    );
    
    if (this.movie.picture) {
      UpdateFormData.append('picture', this.movie.picture);
    }
    console.log('Update movie ID:',this.movieId);
    
    console.log(UpdateFormData)

    // Send the updated data to the backend
    this.http.put(`${this.updateMovieUrl}/${this.movieId}`, UpdateFormData).subscribe({
      next: () => {
        console.log('Movie updated successfully!');
        alert('Movie updated successfully.');
        this.close.emit();
      //   this.router.navigate(['/dashboard']); // Navigate back to the dashboard
      },
      error: (err) => {
        console.error('Error updating movie:', err);
      },
    });
  }

}
