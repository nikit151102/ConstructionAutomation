import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserService } from '../../../services/current-user.service';
import { PersonalAccountService } from '../personal-account.service';
import { ExpenseChartComponent } from './expense-chart/expense-chart.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { TransactionService } from './transaction.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ExpenseChartComponent, TransactionHistoryComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  constructor(private router: Router,
    public currentUserService: CurrentUserService,
    private personalAccountService: PersonalAccountService,
    private transactionService: TransactionService) {
    this.personalAccountService.changeTitle('Главная')
  }

  ngOnInit(): void {
    this.transactionService.getTransactions().subscribe({
      error: (err) => console.error('Error loading transactions', err),
    });
  }

  statisticsCards = [
    { label: 'Пользователи', value: '1,234' },
    { label: 'Посещения', value: '5,678' },
    { label: 'Подписки', value: '345' },
    { label: 'Продажи', value: '789' }
  ];

  executeCommand(item: string) {
    console.log("item", item)
    if (item === 'exit') {
      localStorage.removeItem('YXV0aEFkbWluVG9rZW4=');
      localStorage.removeItem('idAdmin');
      this.router.navigate(['/'])
    } else {
      console.log(localStorage.getItem('YXV0aEFkbWluVG9rZW4='));
      this.router.navigate([`/admin/${localStorage.getItem('YXV0aEFkbWluVG9rZW4=')}/${item}`]);
    }
  }

}
