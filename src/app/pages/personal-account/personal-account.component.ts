import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, HostListener, NgZone, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { ButtonModule } from 'primeng/button';
import { SidebarService } from '../../components/sidebar/sidebar.service';
import { Subscription } from 'rxjs';
import { PersonalAccountService } from './personal-account.service';
import { CurrentUserService } from '../../services/current-user.service';

@Component({
  selector: 'app-personal-account',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, ButtonModule],
  templateUrl: './personal-account.component.html',
  styleUrls: ['./personal-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class PersonalAccountComponent implements OnInit, OnDestroy {
  isSidebarOpen: boolean = true;
  isSmallScreen = false;
  tabTitle: string = '';
  userBalance: any = 0;

  private screenSubscription!: Subscription;

  constructor(public sidebarService: SidebarService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    public personalAccountService: PersonalAccountService,
    private currentUserService: CurrentUserService) { }

  ngOnInit(): void {
    this.personalAccountService.balance$.subscribe((value: string) => {
      this.userBalance = value;
      this.cdr.detectChanges();
    });
    const userData = this.currentUserService.getUser();

    if (userData) {
      this.userBalance = userData.balance;
      this.personalAccountService.changeBalance(userData.balance);
      this.cdr.detectChanges();
    } else {
      this.currentUserService.getUserData().subscribe((data: any) => {
        this.userBalance = data.balance;
        this.cdr.detectChanges();
      });
    }

    this.personalAccountService.titleTab$.subscribe((title: string) => {
      this.tabTitle = title;
      this.cdr.detectChanges();
    });

    this.screenSubscription = this.sidebarService.isSidebarOpen$.subscribe((isOpen: boolean) => {
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
