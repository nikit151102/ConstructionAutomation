import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environment';
import { UserUpdateRequest } from '../../../../../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class FormUserService {

  constructor(private http: HttpClient) { }

  updateUserData(user: UserUpdateRequest): Observable<any> {

    const token = localStorage.getItem('YXV0aFRva2Vu');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.put<any>(`${environment.apiUrl}/api/User/${user.id}`, user, { headers });
  }
  
}
