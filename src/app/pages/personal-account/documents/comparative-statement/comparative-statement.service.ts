import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environment';
import { SelectedFiles } from '../../../../interfaces/files';

@Injectable({
  providedIn: 'root'
})
export class ComparativeStatementService {

  constructor(private http: HttpClient) {}

  uploadFiles(files: SelectedFiles): Observable<any> {

    return this.http.post(environment.apiUrl, files, {
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    });
  }
}
