import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, HostListener, NgZone, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { ButtonModule } from 'primeng/button';
import { SidebarService } from '../../components/sidebar/sidebar.service';
import { Subscription } from 'rxjs';
import { PersonalAccountService } from './personal-account.service';
import { CurrentUserService } from '../../services/current-user.service';
import { FormsModule } from '@angular/forms';
import { TransactionService } from './home/transaction.service';

@Component({
  selector: 'app-personal-account',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, ButtonModule, FormsModule],
  templateUrl: './personal-account.component.html',
  styleUrls: ['./personal-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class PersonalAccountComponent implements OnInit, OnDestroy {
  isSidebarOpen: boolean = true;
  isSmallScreen = false;
  tabTitle: string = '';
  userBalance: any = 0;
  showTopUp: boolean = false;
  topUpAmount: number = 0;

  private screenSubscription!: Subscription;

  constructor(public sidebarService: SidebarService,
    private cdr: ChangeDetectorRef,
    public personalAccountService: PersonalAccountService,
    private currentUserService: CurrentUserService,
    private transactionService: TransactionService) { }

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
        this.userBalance = data.data.balance;
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

  toggleTopUp(): void {
    this.showTopUp = !this.showTopUp;
    console.log('this.showTopUp', this.showTopUp)
  }

  confirmTopUp(): void {
    if (this.topUpAmount > 0) {
      this.personalAccountService.makeTransaction(this.topUpAmount).subscribe({
        next: (response: any) => {
          this.userBalance = response.data.balance;
          this.personalAccountService.changeBalance(response.data.balance);
          this.showTopUp = false;
          this.topUpAmount = 0;
          this.transactionService.getTransactions();
          this.currentUserService.updateUserBalance(response.data.balance)
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Ошибка при пополнении:', error);
        }
      });
    }
  }

  


}
