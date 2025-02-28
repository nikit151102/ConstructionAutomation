import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TabMenuService {

  private activeTabSubject = new BehaviorSubject<string>('personal');
  activeTab$ = this.activeTabSubject.asObservable();

  constructor() { }

  setActiveTab(tab: string) {
    this.activeTabSubject.next(tab);
  }

}
