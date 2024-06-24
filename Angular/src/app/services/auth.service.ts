import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/v1/users'; // Replace with your backend API URL

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      catchError((error) => {
        if (error.status === 400) {
          // Handle 400 Bad Request error (show popup, display message, etc.)
          console.error('Login failed:', error.error.message);
          // Example: Show a popup or toast message
          alert('Invalid email or password. Please try again.');
        }
        return of(error);
      })
    );
  }

  signup(userData: {
    name: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData).pipe(
      tap((response) => this.handleLogin(response)),
      catchError((error) => of(error))
    );
  }

  private handleLogin(response: any): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('userId', response._id);
  }

  logout(): Observable<any> {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    return this.http.get<any>(`${this.apiUrl}/logout`);
  }

  isLoggedIn(): boolean {
    // Implement logic to check if user is logged in, e.g., checking token existence
    return !!localStorage.getItem('token');
  }
}
