import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environment';
import { User, UserUpdateRequest } from '../interfaces/user';
import { ToastService } from './toast.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  private readonly storageKey = 'currentUser';

  constructor(private http: HttpClient,
    private toastService: ToastService,
    private router: Router) { }

  /**
   * Сохраняет объект пользователя в sessionStorage.
   * @param user Объект пользователя для сохранения.
   */
  saveUser(user: any): void {
    if (user) {
      sessionStorage.setItem(this.storageKey, JSON.stringify(user));
    }
  }

  /**
   * Извлекает объект пользователя из sessionStorage.
   * @returns Объект пользователя или `null`, если его нет.
   */
  getUser(): any | null {
    const userData = sessionStorage.getItem(this.storageKey);
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Проверяет, существует ли объект пользователя в sessionStorage.
   * @returns `true`, если объект существует, иначе `false`.
   */
  hasUser(): boolean {
    return sessionStorage.getItem(this.storageKey) !== null;
  }

  /**
   * Удаляет объект пользователя из sessionStorage.
   */
  removeUser(): void {
    sessionStorage.removeItem(this.storageKey);
  }


  /**
 * Обновляет баланс пользователя в sessionStorage.
 * @param newBalance Новый баланс пользователя.
 */
  updateUserBalance(newBalance: string): void {
    const user = this.getUser();
    if (user) {
      user.balance = newBalance; // Обновляем баланс в объекте пользователя.
      this.saveUser(user); // Сохраняем обновленного пользователя обратно в sessionStorage.
    }
  }


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

  getUserData(): Observable<User> {
    return this.UserData().pipe(
      map((data) => {
        this.saveUser(data.data);
        return data;
      }),
      catchError((error) => {
        console.error('Ошибка при получении данных пользователя:', error);
        this.toastService.showError('Сеанс истёк', 'Пожалуйста, выполните повторный вход');
        localStorage.removeItem('YXV0aFRva2Vu');
        this.router.navigate(['/login']);
        return throwError(() => error);
      })
    );
  }

  updateUserData(user: UserUpdateRequest): Observable<any> {

    const token = localStorage.getItem('YXV0aFRva2Vu');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<any>(`${environment.apiUrl}/api/Profile/`, user, { headers });
  }

  deleteUser(): Observable<any> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<any>(`${environment.apiUrl}/api/Profile`, { headers });
  }

}
