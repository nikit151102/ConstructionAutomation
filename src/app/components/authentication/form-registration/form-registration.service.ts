import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class FormRegistrationService {

  constructor(private http: HttpClient) { }

  signUn(formData: { username: string; password: string }): Observable<any> {
    return this.http.post(environment.apiUrl, formData);
  }
  
}
