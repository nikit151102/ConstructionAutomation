import { Component, OnInit } from '@angular/core';
import { UserRole } from '../../../../interfaces/user-role';
import { UserRoleService } from './user-role.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-role',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-role.component.html',
  styleUrl: './user-role.component.scss'
})
export class UserRoleComponent implements OnInit {
  userRoles: UserRole[] = [];
  newUserRole: UserRole = { name: '', permissions: [] };
  selectedUserRole: any | null = null;
  isEditing = false;

  constructor(private userRoleService: UserRoleService) {}

  ngOnInit(): void {
    this.getUserRoles();
  }

  getUserRoles(): void {
    this.userRoleService.getUserRoles().subscribe(
      (roles) => this.userRoles = roles.data,
      (error) => console.error('Ошибка при получении ролей:', error)
    );
  }

addUserRole(): void {

  const newRoleData = {
    name: this.newUserRole.name,
    permissions: ['3fa85f64-5717-4562-b3fc-2c963f66afa6', '3fa85f64-5717-4562-b3fc-2c963f66afa6']
  };

  this.userRoleService.createUserRole(newRoleData).subscribe(
    (role) => {
      this.userRoles.push(role.data);
      this.newUserRole = { name: '', permissions: [] };
    },
    (error) => console.error('Ошибка при создании роли:', error)
  );
}


  editUserRole(role: UserRole): void {
    this.selectedUserRole = { ...role }; 
    this.isEditing = true;
  }
  

updateUserRole(): void {
  if (this.selectedUserRole) {
    const permissionsIdsOnly = this.selectedUserRole.permissions.map((permission: any) => permission.id);
    const updatedRoleData = {
      id: this.selectedUserRole.id,
      name: this.selectedUserRole.name,
      permissions: permissionsIdsOnly
    };


    if(updatedRoleData.id)
    this.userRoleService.updateUserRole(updatedRoleData.id, updatedRoleData).subscribe(
      (updatedRole) => {
        const index = this.userRoles.findIndex(role => role.id === updatedRole.data.id);
        if (index !== -1) {
          this.userRoles[index] = updatedRole.data;
        }
        this.cancelEdit();
      },
      (error) => console.error('Ошибка при обновлении роли:', error)
    );
  }
}

  deleteUserRole(id: string): void {
    this.userRoleService.deleteUserRole(id).subscribe(
      () => this.userRoles = this.userRoles.filter(role => role.id !== id),
      (error) => console.error('Ошибка при удалении роли:', error)
    );
  }

  cancelEdit(): void {
    this.selectedUserRole = null;
    this.isEditing = false;
  }
}