import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  private isSidebarOpen = new BehaviorSubject<boolean>(false);
  isSidebarOpen$ = this.isSidebarOpen.asObservable();

  private isMobileScreen = new BehaviorSubject<boolean>(false);
  isMobileScreen$ = this.isMobileScreen.asObservable();

  width_slide = 256;


  fixedSlidebar: boolean = true;

  constructor(private http: HttpClient) {
    this.checkScreenWidth();
    window.addEventListener('resize', () => this.checkScreenWidth());
  }

  private checkScreenWidth() {
    const isMobile = window.innerWidth <= 768;
    this.isMobileScreen.next(isMobile);
    this.width_slide = isMobile ? 0 : 80;
  }

  toggleSidebar() {
    this.isSidebarOpen.next(!this.isSidebarOpen.value);

  }

  closedSidebar(){
    this.isSidebarOpen.next(false)
  }

  getTypeDocs(): Observable<any> {
    const token = localStorage.getItem('YXV0aFRva2Vu');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${environment.apiUrl}/`, { headers });
  }

}
