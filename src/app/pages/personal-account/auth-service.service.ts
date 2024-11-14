import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  private domain = `${environment.apiUrl}`;

  // Метод для проверки аутентификации
  isAuthenticated(): Observable<boolean> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    if (!token) {
      return of(false); // Если токена нет, возвращаем false
    }

    // Создание заголовков с токеном
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Запрос на получение текущего пользователя
    return this.http.get<any>(`${this.domain}/users/currentUser`, { headers }).pipe(
      map(() => true),  // Если данные возвращены успешно, возвращаем true
      catchError(() => {
        this.logout(); // В случае ошибки выходим из аккаунта
        return of(false); // Возвращаем false
      })
    );
  }

  // Метод для выхода из системы
  logout(): void {
    localStorage.removeItem('YXV0aFRva2Vu'); // Удаляем токен из LocalStorage
  }


  getCurrentUser(): Observable<any> {
    const token = localStorage.getItem('YXV0aFRva2Vu');

    // Создание заголовков с токеном
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Выполнение запроса с заголовками
    return this.http.get(`${environment.apiUrl}/users/currentUser`, { headers });
  }

}
