import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class HistoryFormingService {

  constructor(private http: HttpClient) { }

  getHistoryForming(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/`, {

      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    });
  }

  makeTransaction(): Observable<any> {
    const idUser = localStorage.getItem('VXNlcklk');
    return this.http.put(`${environment.apiUrl}/api/User/MakeTransaction`, {
      "delta": -100,
      "userInstanceId": idUser
    }, {

      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    });
  }

}
