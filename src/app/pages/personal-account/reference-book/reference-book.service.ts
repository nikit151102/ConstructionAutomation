import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class ReferenceBookService {

  public endpoint: string = '';
  constructor(private http: HttpClient) { }

  getHeader(){
    const token = localStorage.getItem('YXV0aFRva2Vu'); 
    return  new HttpHeaders({
      'Authorization': `Bearer ${token}` 
    });
  }
  // Получение всех записей
  getRecords(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/Profile/UserEntities/Organization/${this.endpoint}`, { headers: this.getHeader() });
  }

  // Получение конкретной записи по ID
  getRecord(id: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/Profile/UserEntities/Organization/${this.endpoint}/${id}`, { headers: this.getHeader() });
  }

  // Создание новой записи
  newRecord(record: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/Profile/UserEntities/Organization/${this.endpoint}`, record, { headers: this.getHeader() });
  }

  // Обновление существующей записи
  updateRecord(id: number, record: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/api/Profile/UserEntities/Organization/${this.endpoint}/${id}`, record, { headers: this.getHeader() });
  }

  // Удаление записи
  deleteRecord(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/api/Profile/UserEntities/Organization/${this.endpoint}/${id}`, { headers: this.getHeader() });
  }
}
