import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  API_URL = environment.apiUrl;

  constructor(private httpClient: HttpClient, private router: Router) {}

  verifyUser(data: any): Observable<any> {
    console.log(data);
    return this.httpClient.post(this.API_URL + '/user/sign-in', data).pipe(
      catchError((error) => {
        console.error('Error fetching user', error);
        return throwError(() => new Error('Error fetching user'));
      })
    );
  }
  registerUser(userData: any) {
    return this.httpClient.post(this.API_URL + '/user/sign-up', userData).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error)
        let errorMessage = 'An unknown error occurred.';
  
        if (error.error && typeof error.error === 'object' && 'error' in error) {
          errorMessage = error.error.message; // Extract the error message directly
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }
  
  redirectToLoginPage() {
    return this.router.navigate(['/login']);
  }

  getAuthToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.redirectToLoginPage();
  }

  redirect(){
    return this.router.navigate(['']);
  }
}
