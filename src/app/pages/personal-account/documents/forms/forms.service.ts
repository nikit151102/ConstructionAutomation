import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class FormsService {

  constructor(private http: HttpClient) { }

  uploadFiles(files: FormData, ComparativeStatement: string): Observable<any> {
   
    const token = localStorage.getItem('YXV0aFRva2Vu');

    return this.http.post(`${environment.apiUrl}/api/Profile/${ComparativeStatement}`, files, {

      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
      responseType: 'json', 
    });
  }

  
}
