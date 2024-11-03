import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environment';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  getUserData(): Observable<any> {
    const token = localStorage.getItem('YXV0aFRva2Vu');;
    if (!token) {
      return throwError(() => new Error('Token not found'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(`${environment.apiUrl}/api/User`, { headers }).pipe(
      map(response => response),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }
}
