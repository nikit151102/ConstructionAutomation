import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environment';
import { ToastService } from '../../../services/toast.service';
import { TokenService } from '../../../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private http: HttpClient, 
    private tokenService: TokenService, 
    private toastService: ToastService,
    private router: Router) { }

    getMLWork(data: any): Observable<any> {
      const token = localStorage.getItem('YXV0aFRva2Vu');
    
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
      return this.http.post<any>(`${environment.apiUrl}/`, data, { headers })
    }

    download(id: string): Observable<any> {
      const url = `${environment.apiUrl}/api/Profile/DownloadFile/${id}`;
      const token = localStorage.getItem('YXV0aFRva2Vu');
  
      return this.http.get<Blob>(url, {
        headers: new HttpHeaders({
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }),
        responseType: 'json',
      });
    }
  
}
