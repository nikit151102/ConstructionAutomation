import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserCardComponent } from './components/user-card/user-card.component';
import { FormUserComponent } from './components/form-user/form-user.component';
import { FormDeleteComponent } from './components/form-delete/form-delete.component';
import { CurrentUserService } from '../../../services/current-user.service';
import { PersonalAccountService } from '../personal-account.service';
import { ToastService } from '../../../services/toast.service';
import { TransactionHistoryComponent } from '../home/transaction-history/transaction-history.component';
import { TransactionService } from '../home/transaction.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, UserCardComponent, FormUserComponent, FormDeleteComponent, TransactionHistoryComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  constructor(public currentUserService: CurrentUserService,
    private personalAccountService: PersonalAccountService,
    private toastService: ToastService,
    private transactionService: TransactionService) {
    this.personalAccountService.changeTitle('Профиль')
  }

  currentUser: any;

  ngOnInit(): void {
    if (!this.currentUserService.hasUser()) {
      this.currentUserService.getUserData().subscribe({
        next: (userData) => {
          this.currentUser = userData.data;
          this.currentUserService.saveUser(userData.data)
        },
        error: (err) => {
          const errorMessage = err?.error?.Message || 'Произошла неизвестная ошибка';
          this.toastService.showError('Ошибка', errorMessage);
        },
      });
    } else {
      this.currentUser = this.currentUserService.getUser();
    }

    this.transactionService.getTransactions().subscribe({
      error: (error) => {
        const errorMessage = error?.error?.Message || 'Произошла неизвестная ошибка';
        this.toastService.showError('Ошибка', errorMessage);
      }
    });

  }


}
