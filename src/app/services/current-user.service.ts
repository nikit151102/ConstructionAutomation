import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environment';
import { TokenService } from './token.service';
import { User, UserData } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  currentUser!: UserData;

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  UserData(): Observable<User> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    if (!token) {
      return throwError(() => new Error('Token not found'));
    }
    const idUser = localStorage.getItem('idUser');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<User>(`${environment.apiUrl}/api/User/${idUser}`, { headers }).pipe(
      map(response => response),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  getUserData() {
    this.UserData().subscribe({
      next: (data) => {
        console.log(data)
        this.currentUser = data.data;
      },
      error: (error) => {
        console.error('Ошибка при получении данных пользователя:', error);
      }
    });
  }
}
