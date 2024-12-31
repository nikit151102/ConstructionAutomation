import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environment';
import { UploadData } from '../../../../interfaces/docs';
import { Response } from '../../../../interfaces/common';

@Injectable({
  providedIn: 'root'
})
export class FormsService {

  constructor(private http: HttpClient) { }

  // Эндпоинт для начала формирования документа

  uploadFiles(files: FormData, nameDoc: string): Observable<any> {

    const token = localStorage.getItem('YXV0aFRva2Vu');

    return this.http.post<Response<UploadData>>(`${environment.apiUrl}/api/Profile/${nameDoc}`, files, {

      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
      responseType: 'json',
    });
  }


}
