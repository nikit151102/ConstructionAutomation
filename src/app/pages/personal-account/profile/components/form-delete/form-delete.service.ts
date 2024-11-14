import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class FormDeleteService {

  constructor(private http: HttpClient) { }

  deleteUser(userId: string): Observable<any> {

    const token = localStorage.getItem('YXV0aFRva2Vu');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete<any>(`${environment.apiUrl}/api/User/${userId}`, { headers });
  }

}
