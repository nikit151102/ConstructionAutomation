import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { TokenService } from '../../services/token.service';
import { environment } from '../../../environment';
import { ToastService } from '../../services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private tokenService: TokenService, private http: HttpClient, private toastService: ToastService) {}

  canActivate(): Observable<boolean> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    const cookieConsent = localStorage.getItem('Y29va2llQ29uc2VudA==');
    const idUser = localStorage.getItem('VXNlcklk');

    if (cookieConsent !== 'true') {
      this.handleUnauthorizedAccess('Вы должны согласиться на использование cookie.');
      return of(false);
    }

    if (!idUser) {
      this.handleUnauthorizedAccess('Данные пользователя не найдены.');
      return of(false);
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(`${environment.apiUrl}/api/User/${idUser}`, { headers }).pipe(
      map(() => true),
      catchError(() => {
        this.handleUnauthorizedAccess('Сеанс истек. Пожалуйста, войдите снова.');
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }

  private handleUnauthorizedAccess(message: string): void {
    this.tokenService.clearToken();
    this.toastService.showWarn('Предупреждение', message);
    this.router.navigate(['/login']); 
  }

}
