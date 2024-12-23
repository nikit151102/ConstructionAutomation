import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class FormsService {

  constructor(private http: HttpClient) { }


// Эндпоинт для начала формирования документа

// response
  //   {
  //  status
  //  message
  //  data{
  //    id: string,
  //    statusCode: number,
  //    fileName: string,
  //    fileSize: number,
  //    documentType: number, 
  //    initDate: Date,
  //    DocumentPdfId: string,
  //    DocumentXlsxId: string
  //  }
  // } 
  
  uploadFiles(files: FormData, nameDoc: string): Observable<any> {

    const token = localStorage.getItem('YXV0aFRva2Vu');

    return this.http.post(`${environment.apiUrl}/api/Profile/${nameDoc}`, files, {

      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
      responseType: 'json',
    });
  }


}
