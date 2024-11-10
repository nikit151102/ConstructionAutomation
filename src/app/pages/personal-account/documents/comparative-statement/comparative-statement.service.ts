import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class ComparativeStatementService {

  constructor(private http: HttpClient) { }

  uploadFiles(files: FormData): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/UserDocument/ComparativeStatement`, files, {

      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    });
  }
}
