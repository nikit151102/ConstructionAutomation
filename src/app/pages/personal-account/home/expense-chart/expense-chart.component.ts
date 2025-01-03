import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { DropdownModule } from 'primeng/dropdown';
import { TransactionService } from '../transaction.service';

@Component({
  selector: 'app-expense-chart',
  standalone: true,
  imports: [CommonModule, DropdownModule, ChartModule, FormsModule],
  templateUrl: './expense-chart.component.html',
  styleUrls: ['./expense-chart.component.scss']
})
export class ExpenseChartComponent implements OnInit {
  chartData: any;
  chartOptions: any;
  selectedInterval: string = 'all';

  transactions: any;

  intervals = [
    { label: 'Месяц', value: 'month' },
    { label: 'Квартал', value: 'quarter' },
    { label: 'Год', value: 'year' },
  ];

  constructor(private transactionService: TransactionService) { }

  ngOnInit(): void {
    this.transactionService.transactions$.subscribe({
      next: (data) => {
        this.transactions = data.map(transaction => {
          const parsedDate = this.parseDate(transaction.createDateTime);
          if (parsedDate !== null) {
            transaction.createDateTime = parsedDate.toISOString();  
          }
          return transaction;
        });

        console.log('transactions Data', this.transactions);
        this.updateChart();
      }
    });

    console.log('.getTransactionsSubject()', this.transactionService.getTransactionsSubject());
    this.transactions = this.transactionService.getTransactionsSubject().map(transaction => {
      const parsedDate = this.parseDate(transaction.createDateTime);
      if (parsedDate !== null) {
        transaction.createDateTime = parsedDate.toISOString(); 
      }
      return transaction;
    });
    this.updateChart();
  }

  parseDate(dateString: string): Date | null {
    const parsedDate = new Date(dateString);
    if (isNaN(parsedDate.getTime())) {
      console.error(`Некорректная дата: ${dateString}`);
      return null;
    }
    return parsedDate;
  }

  getFilteredData() {
    const now = new Date();
    let startDate: Date;

    switch (this.selectedInterval) {
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
        startDate = new Date(now.getFullYear(), quarterStartMonth, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
        case 'all':
          return this.transactions.sort((a: any, b: any) => new Date(a.createDateTime).getTime() - new Date(b.createDateTime).getTime());
      default:
        startDate = new Date(0);
    }

    return this.transactions.filter((transaction: any) => {
      const createDateTime = transaction.createDateTime;
      return new Date(createDateTime) >= startDate; // Преобразуем обратно в объект Date для сравнения
    });
  }

  groupTransactionsByDate(filteredData: any[]) {
    const groupedData: { [key: string]: number } = {};

    filteredData.forEach(transaction => {
      // Преобразуем строку в объект Date, если это нужно
      const dateString = new Date(transaction.createDateTime).toLocaleDateString();
      if (!groupedData[dateString]) {
        groupedData[dateString] = 0;
      }
      groupedData[dateString] += transaction.delta;
    });

    return groupedData;
  }

  updateChart(): void {
    const filteredData = this.getFilteredData();
    const groupedData = this.groupTransactionsByDate(filteredData);

    const labels = Object.keys(groupedData);
    const data = Object.values(groupedData);

    const backgroundColors = data.map(value => value >= 0 ? '#66BB6A' : '#EF5350');

    this.chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Транзакции (₽)',
          data: data,
          fill: true,
          backgroundColor: backgroundColors,
        },
      ],
    };

    this.chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem: any) => `₽ ${tooltipItem.raw}`,
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Дата',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Сумма (₽)',
          },
          beginAtZero: true,
        },
      },
    };
  }

}
