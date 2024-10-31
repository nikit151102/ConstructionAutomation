import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { TokenService } from '../../services/token.service';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private tokenService: TokenService, private http: HttpClient) {}

  canActivate(): Observable<boolean> {
    const token = localStorage.getItem('authToken');
    if (!token ) {
      this.tokenService.clearToken()
      this.router.navigate(['/']);
      return of(false);
    }

    // Создание заголовков с токеном
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(`${environment.apiUrl}/users/currentUser`, { headers }).pipe(
      map(() => true), 
      catchError(() => {
        this.tokenService.clearToken()
        this.router.navigate(['/']); 
        return of(false); 
      })
    );
  }
}
