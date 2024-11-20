import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment';


@Injectable({
  providedIn: 'root'
})
export class MyDocumentsService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUserFile(fileId: string): Observable<any> {

    const token = localStorage.getItem('YXV0aFRva2Vu');

    const url = `${this.apiUrl}/api/UserDocument/GetUserFile/${fileId}`;
    return this.http.get<any>(url, {

      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    });
  }

  upload(files: File[]): Observable<any> {
    console.log("servces files", files);
    const url = `${this.apiUrl}/api/UserDocument/upload`;
    const formData = new FormData();
  
    const userId = localStorage.getItem('VXNlcklk');
    if (userId) {
      formData.append('UserId', userId);
    }
  
    files.forEach(file => {
      formData.append('Files', file);
    });
  
    const token = localStorage.getItem('YXV0aFRva2Vu');
  
    return this.http.post<any>(url, formData, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      }),
    });
  }
  
  

  downloadFile(id: string): Observable<Blob> {
    const url = `${this.apiUrl}/api/UserDocument/DownloadFile`;
    const token = localStorage.getItem('YXV0aFRva2Vu');
  
    return this.http.get<Blob>(url, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
      params: { id },  
      responseType: 'blob' as 'json',
    });
  }
  
  

  getAllUserDocuments(): Observable<any[]> {
    const url = `${this.apiUrl}/api/UserDocument`;
    const token = localStorage.getItem('YXV0aFRva2Vu');
    const userId = localStorage.getItem('VXNlcklk'); 
    const params = new HttpParams().set('userId', userId || '');

    return this.http.get<any[]>(url, {
      
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
      params
    });
  }

  deleteFile(id: string): Observable<any> {
    const url = `${this.apiUrl}/api/UserDocument/${id}`;
    const token = localStorage.getItem('YXV0aFRva2Vu');
  
    return this.http.delete<any>(url, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    });
  }


}
