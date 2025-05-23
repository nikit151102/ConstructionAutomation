import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { ButtonModule } from 'primeng/button';
import { SidebarService } from '../../components/sidebar/sidebar.service';
import { Subscription } from 'rxjs';
import { PersonalAccountService } from './personal-account.service';
import { CurrentUserService } from '../../services/current-user.service';
import { FormsModule } from '@angular/forms';
import { TransactionService } from './home/transaction.service';
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
  freeGenerating: any = 0;
  showTopUp: boolean = false;
  topUpAmount: number = 0;
  isLoading: boolean = true;

  private screenSubscription!: Subscription;

  constructor(public sidebarService: SidebarService,
    private cdr: ChangeDetectorRef,
    public personalAccountService: PersonalAccountService,
    private currentUserService: CurrentUserService,
    private transactionService: TransactionService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router) {
  }
  ngOnInit(): void {
    // Подписка на параметры маршрута и загрузка данных пользователя
    this.loadUserDataFromRouteParams();
  
    // Подписка на обновления баланса
    this.subscribeToBalanceChanges();

    this.subscribeToFreeGeneratingChanges();
  
    // Подписка на изменения заголовка вкладки
    this.subscribeToTabTitleChanges();
  
    // Подписка на изменения состояния боковой панели
    this.subscribeToSidebarStateChanges();
  
    // Проверка размера экрана
    this.checkScreenSize();
  }
  
  private loadUserDataFromRouteParams(): void {
    this.route.paramMap.subscribe((params) => {
      const urlId = params.get('id');
      const userData = this.currentUserService.getUser();
  
      if (userData && urlId === userData.id) {
        this.setUserData(userData);
      } else {
        this.fetchUserDataFromService(urlId);
      }
    });
  }
  
  private setUserData(userData: any): void {
    this.userBalance = userData.balance;
    this.personalAccountService.changeBalance(userData.balance);
    this.personalAccountService.changeFreeGenerating(userData.freeGenerating);
    console.log('userData.freeGenerating',userData.freeGenerating)
    const dataStage = {
      userName: `${userData.lastName ?? ''} ${userData.firstName ?? ''}`.trim(),
      email: userData.email
    };
    localStorage.setItem('ZW5jcnlwdGVkRW1haWw=', this.utf8ToBase64(JSON.stringify(dataStage)));
    this.isLoading = false;
    this.cdr.detectChanges();
  }
  
  private fetchUserDataFromService(urlId: string | null): void {
    this.currentUserService.getUserData().subscribe((data: any) => {
      if (data.data && urlId === data.data.id) {
        this.setUserData(data.data);
      } else {
        this.handleUserDataError();
      }
    });
  }
  
  private handleUserDataError(): void {
    this.toastService.showWarn(
      'Предупреждение',
      'Не удалось получить данные профиля. Пожалуйста, убедитесь, что вы вошли в правильный аккаунт и попробуйте снова.'
    );
    this.currentUserService.clearAuthData();
    this.router.navigate(['/login']);
  }
  
  private subscribeToBalanceChanges(): void {
    this.personalAccountService.balance$.subscribe((value: string) => {
      this.userBalance = value;
      this.cdr.detectChanges();
    });
  }
  
  private subscribeToFreeGeneratingChanges(): void {
    this.personalAccountService.freeGenerating$.subscribe((value: string) => {
      this.freeGenerating = value;
      this.cdr.detectChanges();
    });
  }
  


  private subscribeToTabTitleChanges(): void {
    this.personalAccountService.titleTab$.subscribe((title: string) => {
      this.tabTitle = title;
      this.cdr.detectChanges();
    });
  }
  
  private subscribeToSidebarStateChanges(): void {
    this.screenSubscription = this.sidebarService.isSidebarOpen$.subscribe((isOpen: boolean) => {
      this.isSidebarOpen = isOpen;
      this.cdr.detectChanges();
    });
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
          const transaction = {
            createDateTime: response.data.createDateTime,
            changeDateTime: response.data.changeDateTime,
            delta: response.data.delta,
            paymentStatus: response.data.paymentStatus,
            description: response.data.description
          }
          this.transactionService.addTransactionToBeginning(transaction);
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
              let userData = this.currentUserService.getUser();
              if (userData) {
                userData.balance = response.data.balance;
                this.currentUserService.saveUser(userData);
              }
              const transaction = {
                createDateTime: response.data.createDateTime,
                changeDateTime: response.data.changeDateTime,
                delta: response.data.delta,
                paymentStatus: response.data.paymentStatus,
                description: response.data.description
              }
              this.transactionService.updateTransactionById(response.data.id, transaction);

              this.userBalance = response.data.balance;
              this.personalAccountService.changeBalance(response.data.balance);
              this.toastService.showSuccess('Успех!', 'Платеж успешно выполнен.');
              this.cdr.detectChanges();
              checkout.destroy();
            })
          });

          checkout.on('fail', () => {
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



  sanitizeInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.topUpAmount = parseInt(inputElement.value.replace(/\D/g, ''), 10);
  }
  
  

}
