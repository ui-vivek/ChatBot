import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { GreetingResponse } from '../interface/interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  message(msg: string) : Observable<GreetingResponse> {
    return this.http.post<GreetingResponse>(this.baseUrl + '/chatbot', {message: msg}).pipe(
      catchError((error) => {
        console.error('Error fetching data:', error);
        return throwError(error);
      })
    );
  }



}
