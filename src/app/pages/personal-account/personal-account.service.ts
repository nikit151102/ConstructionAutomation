import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PersonalAccountService {

  constructor() { }

  isSidebarOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  
}
