import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, HostListener, NgZone, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { ButtonModule } from 'primeng/button';
import { SidebarService } from '../../components/sidebar/sidebar.service';
import { Subscription } from 'rxjs';
import { PersonalAccountService } from './personal-account.service';
import { CurrentUserService } from '../../services/current-user.service';
import { FormsModule } from '@angular/forms';
import { TransactionService } from './home/transaction.service';
import { TokenService } from '../../services/token.service';
import { environment } from '../../../environment';
import { ToastService } from '../../services/toast.service';

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
    private transactionService: TransactionService,
    private toastService: ToastService) { }

  ngOnInit(): void {



    this.personalAccountService.balance$.subscribe((value: string) => {
      this.userBalance = value;
      this.cdr.detectChanges();
    });
    const userData = this.currentUserService.getUser();

    if (userData) {
      this.userBalance = userData.balance;
      this.personalAccountService.changeBalance(userData.balance);
      const dataStage = {
        userName: `${userData.lastName ?? ''} ${userData.firstName ?? ''}`.trim(),
        email: userData.email
      };
      localStorage.setItem('ZW5jcnlwdGVkRW1haWw=', this.utf8ToBase64(JSON.stringify(dataStage)));
      this.cdr.detectChanges();
    } else {
      this.currentUserService.getUserData().subscribe((data: any) => {
        this.userBalance = data.data.balance;
        this.personalAccountService.changeBalance(data.data.balance);
        const dataStage = {
          userName: `${data.data.lastName ?? ''} ${data.data.firstName ?? ''}`.trim(),
          email: data.data.email
        };

        localStorage.setItem('ZW5jcnlwdGVkRW1haWw=', this.utf8ToBase64(JSON.stringify(dataStage)));
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

  private utf8ToBase64(str: string): string {
    const utf8Bytes = new TextEncoder().encode(str);
    let binary = '';
    utf8Bytes.forEach(byte => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary);
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
  }

  confirmTopUp(): void {
    if (this.topUpAmount > 0) {
      this.personalAccountService.makeTransaction(this.topUpAmount).subscribe({
        next: (response: any) => {
          this.showTopUp = false;
          this.topUpAmount = 0;
          this.openPaymentWidget(response.data.confirmationToken);
          this.transactionService.getTransactions().subscribe({
            error: (err) => console.error('Error loading transactions', err),
          });
          this.currentUserService.updateUserBalance(response.data.balance)
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Ошибка при пополнении:', error);
        }
      });
    }
  }


  openPaymentWidget(confirmationToken: any) {
    const userId = localStorage.getItem('VXNlcklk');
    if ((window as any).YooMoneyCheckoutWidget) {
      const checkout = new (window as any).YooMoneyCheckoutWidget({
        confirmation_token: confirmationToken,
        customization: {
          modal: true,
        },
        error_callback: function (error: any) {
          console.error('Ошибка инициализации виджета оплаты:', error);
        }
      });

      checkout.render()
        .then(() => {
          console.log('Платежная форма успешно загружена');

          checkout.on('success', () => {
            console.log('Оплата прошла успешно');
            this.personalAccountService.checkoutTransaction(confirmationToken).subscribe((response: any) => {
              this.userBalance = response.data.balance;
              this.personalAccountService.changeBalance(response.data.balance);
              this.toastService.showSuccess('Успех!', 'Платеж успешно выполнен.');
              this.cdr.detectChanges();
              checkout.destroy();
            })
          });

          checkout.on('fail', () => {
            console.error('Оплата не удалась');
            this.toastService.showError('Ошибка', 'Произошла ошибка при выполнении платежа. Попробуйте снова.');
            this.personalAccountService.checkoutTransaction(confirmationToken).subscribe((response: any) => {
              checkout.destroy();
            })
          });
        })
        .catch((error: any) => {
          console.error('Ошибка отображения платежной формы:', error);
        });
    } else {
      console.error('Скрипт виджета оплаты не подключен.');
    }
  }



}
