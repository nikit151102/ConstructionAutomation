import { CommonModule } from '@angular/common';
import { Component, OnInit  } from '@angular/core';
import { UsersService } from './users.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, TableModule, InputTextModule, ButtonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {

  users: any;
  sortField: string = ''
  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
    this.usersService.getUsers().subscribe(
      (response: any)  => {
        this.users = response.data;
        console.log('data', response.data)
      },
      error => {
        console.error('Ошибка загрузки данных:', error);
      }
    );
  }
  expandedRows: any = {};

toggleRow(user: any) {
  this.expandedRows[user.userName] = !this.expandedRows[user.userName];
}

}
