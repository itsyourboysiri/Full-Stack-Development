import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private apiUrl = 'http://localhost:5000/api/bookings_collection';

  constructor(private http: HttpClient) {}

  getBookings(date: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${date}`);
  }

  saveBookings(date: string, seats: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}`, { date, seats });
  }
}
