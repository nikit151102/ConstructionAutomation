import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  private isSidebarOpen = new BehaviorSubject<boolean>(false);
  isSidebarOpen$ = this.isSidebarOpen.asObservable(); // Exported for subscription

  private isMobileScreen = new BehaviorSubject<boolean>(false);
  isMobileScreen$ = this.isMobileScreen.asObservable(); // Exported for subscription

  width_slide = 78; // Default width for desktop
  isSidebarClosed: boolean = true;

  constructor() {
    // Initialize screen width check
    this.checkScreenWidth();
    // Add listener for screen resize
    window.addEventListener('resize', () => this.checkScreenWidth());
  }

  private checkScreenWidth() {
    const isMobile = window.innerWidth <= 768; // Mobile mode if width <= 768px
    this.isMobileScreen.next(isMobile); // Update state
    this.width_slide = isMobile ? 0 : 78; // Set sidebar width based on device
  }

  toggleSidebar() {
    this.isSidebarOpen.next(!this.isSidebarOpen.value);
    this.isSidebarClosed = !this.isSidebarClosed;
  }
}
