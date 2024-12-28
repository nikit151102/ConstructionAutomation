import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonalAccountService {

  constructor() { }

  isSidebarOpen = false;
  title_tab: string = '';

  private userBalanceSubject = new BehaviorSubject<string>('');
  balance$ = this.userBalanceSubject.asObservable();

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

}
