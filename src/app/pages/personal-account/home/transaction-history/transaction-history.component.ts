import { Component } from '@angular/core';
import { Transaction } from '../../../../interfaces/docs';
import { Response } from '../../../../interfaces/common';
import { TransactionService } from './transaction.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.scss'
})
export class TransactionHistoryComponent {

  transactions: Transaction[] = [];

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.transactionService.getTransactions().subscribe({
      next: (response: Response<Transaction[]>) => {
        this.transactions = response.data;
        console.log('Response',response)
        
      },
      error: (err) => console.error('Error fetching transactions', err),
    });
  }
  
}
