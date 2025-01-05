import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { WebSocketService } from '../../websocket.service';

@Component({
  selector: 'seat-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './seating.component.html',
  styleUrls: ['./seating.component.css']
})
export class SeatingComponent implements OnInit {
  // Movie and Showtime Management
  movies: any[] = [];
  selectedMovie: string = '';
  selectedTime: string = '';
  selectedMovieTimes: string[] = [];
  selectedMovieImage: string = '';

  // Calendar Management
  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();
  currentDate: number = new Date().getDate();
  selectedDay: { day: number; month: number; year: number } | null = null;
  calendarDays: ({ day: number; isCurrent: boolean; isSelected: boolean } | null)[] = [];

  dayNames: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Seat Management
  rows = [
    Array(7).fill(null).map(() => ({ selected: false, booked: false })),
    Array(12).fill(null).map(() => ({ selected: false, booked: false })),
    Array(15).fill(null).map(() => ({ selected: false, booked: false })),
    Array(12).fill(null).map(() => ({ selected: false, booked: false })),
    Array(7).fill(null).map(() => ({ selected: false, booked: false })),
  ];
  bookedSeat: { row: number; seat: number; status: string } | null = null;


  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private wsService: WebSocketService) {}

  

  ngOnInit(): void {
    const today = new Date();
    this.selectedDay = { day: today.getDate(), month: today.getMonth(), year: today.getFullYear() };
    this.generateCalendar();
    this.loadMovies();
  }

  generateCalendar(): void {
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    const lastDayOfMonth = new Date(this.currentYear, this.currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDay = firstDayOfMonth.getDay();

    this.calendarDays = [];

    for (let i = 0; i < startingDay; i++) {
      this.calendarDays.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isCurrentDay =
        day === this.currentDate &&
        this.currentMonth === new Date().getMonth() &&
        this.currentYear === new Date().getFullYear();
      const isSelectedDay =
        this.selectedDay?.day === day &&
        this.selectedDay?.month === this.currentMonth &&
        this.selectedDay?.year === this.currentYear;

      this.calendarDays.push({ day, isCurrent: isCurrentDay, isSelected: isSelectedDay });
    }
  }

  prevMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }

  selectDay(day: { day: number; isCurrent: boolean } | null): void {
    if (day) {
      this.resetSeats();
      this.selectedDay = { day: day.day, month: this.currentMonth, year: this.currentYear };
      this.loadBookingsForDate();
      this.generateCalendar();
    }
  }

  loadMovies(): void {
    this.http.get<any[]>('http://localhost:5000/api/users/getmovies').subscribe(
      (movies) => {
        // Add a default "Select Movie" option at the beginning of the list
        this.movies = [{ movieName: 'Select Movie', showTimes: [], picture: '' }, ...movies];
        
        // Set default selections
        this.selectedMovie = this.movies[0].movieName; // "Select Movie"
        this.selectedMovieImage = ''; // Optionally set a placeholder or blank image
        this.selectedMovieTimes = ['Select Time'];
        this.selectedTime = 'Select Time';
        
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching movies:', error);
      }
    );
  }
  
  
  
  

  onMovieChange(): void {
    const selectedMovie = this.movies.find((movie) => movie.movieName === this.selectedMovie);
    if (selectedMovie) {
      this.selectedMovieImage = selectedMovie.picture;
      this.selectedMovieTimes = selectedMovie.showTimes;
      this.selectedTime = this.selectedMovieTimes[0];
      this.loadBookingsForDate();
    }
  }
  

  loadBookingsForDate(): void {
    if (!this.selectedDay || !this.selectedMovie || !this.selectedTime) {
      // Ensure seats are reset if no valid booking context
      this.resetSeats();
      return;
    }
  
    const formattedDate = `${this.selectedDay.year}-${this.selectedDay.month + 1}-${this.selectedDay.day}`;
    const url = `http://localhost:5000/api/bookings_collection/${formattedDate}/${this.selectedMovie}/${this.selectedTime}`;
  
    // Reset seats before making the HTTP request
    this.resetSeats();
  
    this.http.get<any>(url).subscribe(
      (response) => {
        if (response && response.seats && response.seats.length > 0) {
          // Populate booked seats based on the response
          response.seats.forEach((seat: { row: number; seat: number }) => {
            if (
              seat.row > 0 &&
              seat.row <= this.rows.length &&
              seat.seat > 0 &&
              seat.seat <= this.rows[seat.row - 1].length
            ) {
              this.rows[seat.row - 1][seat.seat - 1].booked = true;
            }
          });
        } else {
          console.log('No bookings found for the selected configuration.');
        }
      },
      (error) => {
        console.error('Error fetching bookings:', error);
        this.resetSeats(); // Ensure seats are cleared on error
      }
    );
  }
  
  resetSeats(): void {
    this.rows.forEach((row) => {
      row.forEach((seat) => {
        seat.selected = false;
        seat.booked = false;
      });
    });
  }

  toggleSeat(rowIndex: number, seatIndex: number): void {
    const seat = this.rows[rowIndex][seatIndex];
    if (!seat.booked) {
      seat.selected = !seat.selected;
      this.bookedSeat = seat.selected
        ? { row: rowIndex + 1, seat: seatIndex + 1, status: 'Selected' }
        : null;
    }
  }

  getSeatNumber(rowIndex: number, seatIndex: number): number {
    let seatStart = 1;
    for (let i = 0; i < rowIndex; i++) {
      seatStart += this.rows[i].length;
    }
    return seatStart + seatIndex;
  }

  saveBookings(): void {
    if (!this.selectedDay || !this.selectedMovie || !this.selectedTime) return;

    const formattedDate = `${this.selectedDay.year}-${this.selectedDay.month + 1}-${this.selectedDay.day}`;
    const seats = this.rows.flatMap((row, rowIndex) =>
      row
        .map((seat, seatIndex) => (seat.booked ? { row: rowIndex + 1, seat: seatIndex + 1 } : null))
        .filter((seat) => seat !== null)
    );

    const bookingData = {
      date: formattedDate,
      movieName: this.selectedMovie,
      showTime: this.selectedTime,
      seats,
    };
    const bookingId = `${this.selectedMovie}-${formattedDate}-${this.selectedTime}`;
    this.wsService.sendMessage({ type: 'update-booking', payload: { bookingId, seats } });

    this.http.post('http://localhost:5000/api/savebooking_collection', bookingData).subscribe(
      (response) => {
        console.log('Booking saved successfully:', response);

        // Reload bookings to ensure UI consistency
        this.loadBookingsForDate();
      },
      (error) => {
        console.error('Error saving booking:', error);
      }
    );
  }

  confirmBooking(rowIndex: number, seatIndex: number): void {
    const seat = this.rows[rowIndex][seatIndex];
    if (seat.selected) {
      seat.booked = true;
      seat.selected = false;
      this.saveBookings();
    }
  }

  removeBooking(rowIndex: number, seatIndex: number): void {
    const seat = this.rows[rowIndex][seatIndex];
    if (seat.booked) {
      seat.booked = false;
      this.saveBookings();
    }
  }
}
