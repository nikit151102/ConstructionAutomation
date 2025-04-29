import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class UnsubscribeMailingService {

  constructor(private http: HttpClient) { }

  verifyEmail(id: string): Observable<any> {
    return this.http.patch<any>(`${environment.apiUrl}/api/Profile/Confirmation/${id}`, {});
  }
}