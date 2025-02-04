import { Component, HostListener } from '@angular/core';
import { Transaction } from '../../../../interfaces/docs';
import { Response } from '../../../../interfaces/common';
import { TransactionService } from '../transaction.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.scss'
})
export class TransactionHistoryComponent {

  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  searchQuery: string = '';
  filterType: 'all' | 'positive' | 'negative' = 'all';
  dropdownState: any = {
    filter: false,
    sort: false
  };

  constructor(private transactionService: TransactionService) { }

  ngOnInit(): void {
    this.transactionService.transactions$.subscribe(
      (data) => {
        this.transactions = data;
        this.filteredTransactions = [...this.transactions];
      });

    this.filteredTransactions = [...this.transactions];
  }

  applyFilters(): void {
    const searchLower = this.searchQuery.toLowerCase();

    this.filteredTransactions = this.transactions.filter((transaction) => {
      const matchesSearch =
        transaction.createDateTime.toLowerCase().includes(searchLower) ||
        transaction.delta.toString().includes(searchLower);

      const matchesType =
        this.filterType === 'all' ||
        (this.filterType === 'positive' && transaction.delta > 0) ||
        (this.filterType === 'negative' && transaction.delta < 0);

      return matchesSearch && matchesType;
    });
  }

  filterByType(type: 'all' | 'positive' | 'negative'): void {
    this.filterType = type;
    this.applyFilters();
    this.closeDropdowns();
  }

  sortBy(criteria: 'date' | 'amount'): void {
    if (criteria === 'date') {
      this.filteredTransactions.sort(
        (a, b) => new Date(b.createDateTime).getTime() - new Date(a.createDateTime).getTime()
      );
    } else if (criteria === 'amount') {
      this.filteredTransactions.sort((a, b) => b.delta - a.delta);
    }
    this.closeDropdowns();
  }

  toggleDropdown(type: string): void {
    this.dropdownState[type] = !this.dropdownState[type];
  }

  closeDropdowns(): void {
    this.dropdownState.filter = false;
    this.dropdownState.sort = false;
  }

  @HostListener('document:mousedown', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const filterDropdown = document.querySelector('.dropdown-content');
    const sortDropdown = document.querySelector('.dropdown-content');

    if (filterDropdown && !filterDropdown.contains(event.target as Node) &&
      sortDropdown && !sortDropdown.contains(event.target as Node)) {
      this.closeDropdowns();
    }
  }

  getPaymentStatusLabel(status: number): string {
    const statuses: { [key: number]: string } = {
      1: 'Рассматривается',
      2: 'Подтверждено',
      3: 'Отменена',
      4: 'Не подтвержден',
    };
    return statuses[status] || 'Неизвестный статус';
  }
  
  getPaymentStatusClass(status: number): string {
    const statusClasses: { [key: number]: string } = {
      1: 'status-info',
      2: 'status-success',
      3: 'status-danger',
      4: 'status-secondary',
    };
    return statusClasses[status] || 'status-secondary';
  }

  
}
