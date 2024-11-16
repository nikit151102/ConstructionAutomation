import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-expense-chart',
  standalone: true,
  imports: [CommonModule, DropdownModule, ChartModule, FormsModule],
  templateUrl: './expense-chart.component.html',
  styleUrl: './expense-chart.component.scss'
})
export class ExpenseChartComponent implements OnInit {
  chartData: any;
  chartOptions: any;
  selectedInterval: string = 'month';

  expenses = [
    { date: new Date(2024, 0, 1), amount: 50 },
    { date: new Date(2024, 0, 2), amount: 20 },
    { date: new Date(2024, 1, 15), amount: 100 },
    { date: new Date(2024, 3, 20), amount: 80 },
    { date: new Date(2024, 6, 10), amount: 150 },
    { date: new Date(2024, 10, 1), amount: 45 },
    { date: new Date(2024, 10, 2), amount: 60 },
    { date: new Date(2024, 10, 3), amount: 30 },
    { date: new Date(2024, 10, 4), amount: 50 },
    { date: new Date(2024, 10, 5), amount: 80 },
    { date: new Date(2024, 10, 6), amount: 70 },
    { date: new Date(2024, 10, 7), amount: 90 },
    { date: new Date(2024, 10, 8), amount: 40 },
    { date: new Date(2024, 10, 9), amount: 100 },
    { date: new Date(2024, 10, 10), amount: 120 },
    { date: new Date(2024, 10, 11), amount: 110 },
    { date: new Date(2024, 10, 12), amount: 130 },
    { date: new Date(2024, 10, 13), amount: 75 },
    { date: new Date(2024, 10, 14), amount: 95 },
    { date: new Date(2024, 10, 15), amount: 85 },
  ];

  intervals = [
    { label: 'Месяц', value: 'month' },
    { label: 'Квартал', value: 'quarter' },
    { label: 'Год', value: 'year' },
  ];

  ngOnInit(): void {
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

    return this.expenses.filter(expense => expense.date >= startDate);
  }

  updateChart(): void {
    const filteredData = this.getFilteredData();
    const labels = filteredData.map(item => item.date.toLocaleDateString());
    const data = filteredData.map(item => item.amount);

    this.chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Траты (₽)',
          data: data,
          fill: false,
          borderColor: '#42A5F5',
          tension: 0.4,
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