import {
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
/**
 * An HTTP interceptor that adds an authorization header to outgoing requests.
 * If an unauthorized request is detected, it will redirect the user to the login page.
 *
 * @param {HttpRequest<T>} req - The request to be sent.
 * @param {HttpHandler} next - The next handler in the chain.
 * @returns {Observable<HttpEvent<T>>} - The modified request or the error if any.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const _aithService = inject(AuthService)
  const authToken = localStorage.getItem('token');
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return next(authReq).pipe(
    catchError((err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 403) {
          console.error('Unauthorized request:', err);
          _aithService.redirectToLoginPage()
        } else {
          console.error('HTTP error:', err);
        }
      } else {
        console.error('An error occurred:', err);
      }

      return throwError(() => err);
    })
  );
};
