import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserRole } from '../../../../interfaces/user-role';
import { environment } from '../../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {


  constructor(private http: HttpClient) { }

  // Получить все роли
  getUserRoles(): Observable<any> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<UserRole[]>(`${environment.apiUrl}/api/UserRole`, { headers });
  }

  // Получить роль по id
  getUserRoleById(id: string): Observable<any> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<UserRole>(`${environment.apiUrl}/api/UserRole/${id}`, { headers });
  }

  // Создать новую роль
  createUserRole(userRole: UserRole): Observable<any> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<UserRole>(`${environment.apiUrl}/api/UserRole`, userRole, { headers });
  }

  // Обновить роль по id
  updateUserRole(id: string, userRole: UserRole): Observable<any> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<UserRole>(`${environment.apiUrl}/api/UserRole/${id}`, userRole, { headers });
  }

  // Удалить роль по id
  deleteUserRole(id: string): Observable<void> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<void>(`${environment.apiUrl}/api/UserRole/${id}`, { headers });
  }
}
