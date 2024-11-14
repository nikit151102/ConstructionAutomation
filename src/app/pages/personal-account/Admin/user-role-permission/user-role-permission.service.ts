import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class UserRolePermissionService {

  constructor(private http: HttpClient) {}

  // Получить все UserRolePermissions
  getUserRolePermissions(): Observable<any> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${environment.apiUrl}/api/UserRolePermission`, { headers });
  }

  // Получить UserRolePermission по ID
  getUserRolePermissionById(id: string): Observable<any> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${environment.apiUrl}/api/UserRolePermission/${id}`, { headers });
  }

  // Создать новый UserRolePermission
  createUserRolePermission(data: { name: string, endPointName: string }): Observable<any> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${environment.apiUrl}/api/UserRolePermission`, data, { headers });
  }

  // Обновить существующий UserRolePermission
  updateUserRolePermission(id: string, data: { name: string, endPointName: string }): Observable<any> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any>(`${environment.apiUrl}/api/UserRolePermission/${id}`, data, { headers });
  }

  // Удалить UserRolePermission
  deleteUserRolePermission(id: string): Observable<any> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<any>(`${environment.apiUrl}/api/UserRolePermission/${id}`, { headers });
  }
}