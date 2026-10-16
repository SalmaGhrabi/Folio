import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {TokenService} from '../token/token';
import {Router} from '@angular/router';
import {ApiConfiguration} from '../api-configuration';
import {catchError, throwError} from 'rxjs';

export const httpTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const apiRoot = inject(ApiConfiguration).rootUrl;

  const isApiCall = req.url.startsWith(apiRoot);
  const isAuthCall = req.url.startsWith(apiRoot + '/auth');
  const token = tokenService.token;

  const request = token && isApiCall
    ? req.clone({headers: req.headers.set('Authorization','Bearer '+ token) })
    :req;

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      // Expired or invalid session: drop the token and go back to the login page.
      // Login/register failures (also 401) must stay on their page to show the error.
      if (error.status === 401 && isApiCall && !isAuthCall) {
        tokenService.clear();
        router.navigate(['login']);
      }
      return throwError(() => error);
    })
  );
};
