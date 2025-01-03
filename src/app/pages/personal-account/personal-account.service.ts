import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class PersonalAccountService {

  constructor(private http: HttpClient) { }

  isSidebarOpen = false;
  title_tab: string = '';

  private userBalanceSubject = new BehaviorSubject<string>('');
  balance$ = this.userBalanceSubject.asObservable();

  getCurrentBalance(): string {
    return this.userBalanceSubject.value;
  }

  changeBalance(value: any) {
    this.userBalanceSubject.next(value);
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  private titleTabSubject = new BehaviorSubject<string>('');
  titleTab$ = this.titleTabSubject.asObservable();

  changeTitle(title: string) {
    this.titleTabSubject.next(title);
  }

  makeTransaction(value: number) {
    const url = `${environment.apiUrl}/api/Profile/MakeTransaction`;
    const token = localStorage.getItem('YXV0aFRva2Vu');

    return this.http.put(url, {delta: value},{
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    });
  }

}
