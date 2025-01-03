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
  selectedInterval: string = 'month';

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
        this.transactions = data;
        this.updateChart();
      }
    });
    this.updateChart();
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
      default:
        startDate = new Date(0);
    }

    return this.transactions.filter((transaction: any) => transaction.createDateTime >= startDate);
  }

  groupTransactionsByDate(filteredData: any[]) {
    const groupedData: { [key: string]: number } = {};

    filteredData.forEach(transaction => {
      const dateString = transaction.createDateTime.toLocaleDateString();
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
