import { Component, OnInit } from '@angular/core';
import { UserRolePermissionService } from './user-role-permission.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-role-permission',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-role-permission.component.html',
  styleUrl: './user-role-permission.component.scss'
})
export class UserRolePermissionComponent implements OnInit {
  userRolePermissions: any[] = [];
  selectedUserRolePermission: any = null;
  newUserRolePermission: { name: string, endPointName: string } = { name: '', endPointName: '' };

  constructor(private userRolePermissionService: UserRolePermissionService) {}

  ngOnInit(): void {
    this.loadUserRolePermissions();
  }

  loadUserRolePermissions(): void {
    this.userRolePermissionService.getUserRolePermissions().subscribe(
      data => {
        this.userRolePermissions = data.data;
      },
      error => {
        console.error('Ошибка загрузки данных:', error);
      }
    );
  }

  loadUserRolePermission(id: string): void {
    this.userRolePermissionService.getUserRolePermissionById(id).subscribe(
      data => {
        this.selectedUserRolePermission = data.data;
      },
      error => {
        console.error('Ошибка загрузки данных:', error);
      }
    );
  }

  createUserRolePermission(): void {
    this.userRolePermissionService.createUserRolePermission(this.newUserRolePermission).subscribe(
      data => {
        console.log('UserRolePermission создан:', data.data);
        this.loadUserRolePermissions();
        this.newUserRolePermission = { name: '', endPointName: '' }; 
      },
      error => {
        console.error('Ошибка создания:', error);
      }
    );
  }

  updateUserRolePermission(id: string): void {
    this.userRolePermissionService.updateUserRolePermission(id, this.selectedUserRolePermission).subscribe(
      data => {
        console.log('UserRolePermission обновлен:', data.data);
        this.loadUserRolePermissions();
      },
      error => {
        console.error('Ошибка обновления:', error);
      }
    );
  }

  deleteUserRolePermission(id: string): void {
    this.userRolePermissionService.deleteUserRolePermission(id).subscribe(
      data => {
        console.log('UserRolePermission удален:', data.data);
        this.loadUserRolePermissions();
      },
      error => {
        console.error('Ошибка удаления:', error);
      }
    );
  }
}
