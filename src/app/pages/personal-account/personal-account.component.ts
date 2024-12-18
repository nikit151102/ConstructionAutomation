import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, HostListener, NgZone } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { ButtonModule } from 'primeng/button';
import { SidebarService } from '../../components/sidebar/sidebar.service';
import { Subscription } from 'rxjs';
import { PersonalAccountService } from './personal-account.service';

@Component({
  selector: 'app-personal-account',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, ButtonModule],
  templateUrl: './personal-account.component.html',
  styleUrls: ['./personal-account.component.scss'],

})
export class PersonalAccountComponent implements OnInit, OnDestroy {
  isSidebarOpen: boolean = true;
  isSmallScreen = false;
  tabTitle: string = '';
  private screenSubscription!: Subscription;

  constructor(public sidebarService: SidebarService,
    private ngZone: NgZone,
     private cdr: ChangeDetectorRef, public personalAccountService: PersonalAccountService) { }

  ngOnInit(): void {
    this.personalAccountService.titleTab$.subscribe((title: string) => {
      this.tabTitle = title;
      this.cdr.detectChanges();
    })
    this.screenSubscription = this.sidebarService.isSidebarOpen$.subscribe((isOpen) => {
      this.isSidebarOpen = isOpen;
      this.cdr.detectChanges();
    });
    this.checkScreenSize();
  }
  

  ngOnDestroy(): void {
    if (this.screenSubscription) {
      this.screenSubscription.unsubscribe();
    }
  }

  toggleSidebar(): void {
    this.personalAccountService.toggleSidebar();
    this.sidebarService.toggleSidebar();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    this.isSmallScreen = window.innerWidth < 768;
  }
}
