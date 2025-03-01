import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError } from 'rxjs';
import { environment } from '../../../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class ReferenceService {

  constructor(private http: HttpClient) { }


  private referenceDataSubject = new BehaviorSubject<any>([]);
  referenceData$ = this.referenceDataSubject.asObservable();
  
  setReferenceData(value: any) {
    this.referenceDataSubject.next(value);
  }

  loadData(endpoint: string): Observable<{ message: string; status: number; data: any[] }> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    if (!token) {
      console.error('Token is missing');
      return new Observable(); // Возвращаем пустой Observable
    }

    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });

    return this.http.get<{ message: string; status: number; data: any[] }>(
      `${environment.apiUrl}${endpoint}`,
      { headers }
    )
  }
}