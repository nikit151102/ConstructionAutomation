import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { CurrentUserService } from '../../../../../services/current-user.service';
import { UserData, UserUpdateRequest } from '../../../../../interfaces/user';
import { FormUserService } from './form-user.service';

@Component({
  selector: 'app-form-user',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    FileUploadModule,
    ButtonModule,
    MessagesModule,
    MessageModule,
  ],
  templateUrl: './form-user.component.html',
  styleUrl: './form-user.component.scss'
})
export class FormUserComponent implements OnInit {

  @Input() currentUser:any;
  userProfileForm!: FormGroup;
  avatarPreviewUrl: string | null = null;

  constructor(private fb: FormBuilder, public currentUserService: CurrentUserService, private formUserService: FormUserService) { }

  ngOnInit(): void {
    this.userProfileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      patronymic: [''],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      tgUserName: [{ value: '@', disabled: true }, [Validators.required]],
      avatar: [null],
    });

    if (!this.currentUser) {
      this.currentUserService.getUserData();
      this.currentUserService.UserData().subscribe({
        next: (userData) => this.fillForm(userData.data),
        error: (error) => console.error('Ошибка при получении данных пользователя:', error)
      });
    } else {
      this.fillForm(this.currentUser);
    }

  }

  fillForm(userData: UserData): void {
    this.userProfileForm.patchValue({
      firstName: userData.firstName,
      lastName: userData.lastName,
      patronymic: userData.patronymic,
      email: userData.email,
      tgUserName: userData.userName ? `@${userData.userName}` : '@',
    });
  }

  onTgUserNameInput() {
    const tgUserNameControl = this.userProfileForm.get('tgUserName');
    if (tgUserNameControl && !tgUserNameControl.value.startsWith('@')) {
      tgUserNameControl.setValue('@' + tgUserNameControl.value);
    }
  }

  onAvatarUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.avatarPreviewUrl = URL.createObjectURL(file);
      this.userProfileForm.patchValue({ avatar: file });
    }
  }

  removeAvatar() {
    this.avatarPreviewUrl = null;
    this.userProfileForm.patchValue({ avatar: null });
    this.userProfileForm.get('avatar')?.markAsTouched();
  }

  updateUser() {
    if (!this.currentUser.id) {
      console.error("User ID is missing");
      return;
    }

    const userUpdateRequest: any = {
      id: this.currentUser.id,
      firstName: this.userProfileForm.value.firstName,
      lastName: this.userProfileForm.value.lastName,
      patronymic: this.userProfileForm.value.patronymic,
      // email: this.userProfileForm.value.email,
      // userName: this.userProfileForm.value.tgUserName.replace('@', ''),
      roleIds: this.getRoleIds()
    };

    // Нужно подправить
    this.formUserService.updateUserData(userUpdateRequest).subscribe((data: any) => {
      this.currentUserService.UserData().subscribe({
        next: (data) => {
          this.currentUser = data.data;
          this.currentUserService.saveUser(data.data);
        },
        error: (error) => {
          console.error('Ошибка при получении данных пользователя:', error);
        }
      });
    })
  }

  getRoleIds(): string[] {
    if (!this.currentUser) {
      console.error('Пользователь не найден');
      return [];
    }
    return this.currentUser.roles.map((role: any) => role.id);
  }

  get formControls() {
    return this.userProfileForm.controls;
  }

  onSubmit() {
    if (this.userProfileForm.valid) {
      this.updateUser();
    } else {
      this.userProfileForm.markAllAsTouched();

    }
  }
}