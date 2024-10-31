import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class CompStatementService {


  constructor(private http: HttpClient) {}

  uploadFiles(files: File[]): Observable<any> {
    const formData = new FormData();

    files.forEach((file, index) => {
      formData.append('file' + index, file, file.name);
    });

    return this.http.post(environment.apiUrl, formData, {
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    });
  }
}
