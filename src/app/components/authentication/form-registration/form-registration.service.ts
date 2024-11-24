import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class FormRegistrationService {

  constructor(private http: HttpClient) { }

  signUn(formData: {
    FirstName?: string;
    LastName?: string;
    UserName?: string;
    TgId?: string;
    Email?: string;
    Password?: string;
    Roles?: string[];
  }
  ): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/register`, formData);
  }

}
