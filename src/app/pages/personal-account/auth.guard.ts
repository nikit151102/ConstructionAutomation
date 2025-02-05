import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from '../../services/token.service';
import { ToastService } from '../../services/toast.service';
import { CurrentUserService } from '../../services/current-user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private tokenService: TokenService,
    private toastService: ToastService,
    private currentUserService: CurrentUserService
  ) { }

  canActivate(): Promise<boolean> {
    return new Promise((resolve) => {
      const token = localStorage.getItem('YXV0aFRva2Vu');
      const cookieConsent = localStorage.getItem('Y29va2llQ29uc2VudA==');
      const idUser = localStorage.getItem('VXNlcklk');

      if (cookieConsent !== 'true') {
        this.handleUnauthorizedAccess('Вы должны согласиться на использование cookie.');
        this.currentUserService.clearAuthData();
        return resolve(false);
      }

      if (!idUser) {
        this.handleUnauthorizedAccess('Данные пользователя не найдены.');
        this.currentUserService.clearAuthData();
        return resolve(false);
      }

      if (!token) {
        this.handleUnauthorizedAccess('Токен не найден. Войдите снова.');
        this.currentUserService.clearAuthData();
        return resolve(false);
      }

      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      this.currentUserService.getDataUser().subscribe({
        next: (response) => {
          if (response.data) {
            localStorage.setItem('VXNlcklk', response.data.id);
            const dataStage = {
              userName: `${response.data.lastName ?? ''} ${response.data.firstName ?? ''}`.trim(),
              email: response.data.email
            };

            localStorage.setItem('ZW5jcnlwdGVkRW1haWw=', this.utf8ToBase64(JSON.stringify(dataStage)));
            this.currentUserService.saveUser(response.data);
            resolve(true);

          } else {
            this.handleUnauthorizedAccess('Не удалось получить данные о пользователе. Попробуйте снова');
            this.currentUserService.clearAuthData();
            resolve(false);
          }
        },
        error: (err) => {
          console.error('Ошибка запроса:', err);
          this.handleUnauthorizedAccess('Сеанс истек. Пожалуйста, войдите снова.');
          this.currentUserService.clearAuthData();
          resolve(false);
        },
      });

    });
  }

  private utf8ToBase64(str: string): string {
    const utf8Bytes = new TextEncoder().encode(str);
    let binary = '';
    utf8Bytes.forEach(byte => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary);
  }

  private handleUnauthorizedAccess(message: string): void {
    this.tokenService.clearToken();
    this.toastService.showWarn('Предупреждение', message);
    this.router.navigate(['/login']);
  }


}
