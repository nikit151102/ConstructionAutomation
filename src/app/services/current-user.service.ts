import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environment';
import { TokenService } from './token.service';
import { User, UserData } from '../interfaces/user';
import { ToastService } from './toast.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  currentUser!: UserData;

  constructor(private http: HttpClient, 
    private tokenService: TokenService, 
    private toastService: ToastService,
    private router: Router) { }

  UserData(): Observable<User> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    if (!token) {
      return throwError(() => new Error('Token not found'));
    }
    const idUser = localStorage.getItem('VXNlcklk');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<User>(`${environment.apiUrl}/api/Profile`, { headers }).pipe(
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
        this.toastService.showError('Сеанс истёк', 'Пожалуйста, выполните повторный вход');
        localStorage.removeItem('YXV0aFRva2Vu');
        this.router.navigate(['/login']);
      }
    });
  }
}
