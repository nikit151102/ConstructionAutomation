import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { CurrentUserService } from '../../../../../services/current-user.service';
import { UserData } from '../../../../../interfaces/user';
import { ToastService } from '../../../../../services/toast.service';
import { DropdownModule } from 'primeng/dropdown';

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
    DropdownModule,
  ],
  templateUrl: './form-user.component.html',
  styleUrl: './form-user.component.scss'
})
export class FormUserComponent implements OnInit {

  @Input() currentUser:any;
  userProfileForm!: FormGroup;
  avatarPreviewUrl: string | null = null;


  timezones = [
    { label: 'Калининград (UTC+2)', value: 2 },
    { label: 'Москва, Санкт-Петербург (UTC+3)', value: 3 },
    { label: 'Самара (UTC+4)', value: 4 },
    { label: 'Екатеринбург (UTC+5)', value: 5 },
    { label: 'Омск (UTC+6)', value: 6 },
    { label: 'Красноярск (UTC+7)', value: 7 },
    { label: 'Иркутск (UTC+8)', value: 8 },
    { label: 'Якутск (UTC+9)', value: 9 },
    { label: 'Владивосток (UTC+10)', value: 10 },
    { label: 'Магадан (UTC+11)', value: 11 },
    { label: 'Камчатка, Анадырь (UTC+12)', value: 12 }
];


  constructor(private fb: FormBuilder, 
    public currentUserService: CurrentUserService,
        private toastService:ToastService) { }

  ngOnInit(): void {
    this.userProfileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      patronymic: [''],
      inn: [''],
      registerNumber: [''],
      registerNumberBuilder: [''],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      tgUserName: [{ value: '@', disabled: true }, [Validators.required]],
      avatar: [null],
      hoursOffset: ['']
    });

    if (!this.currentUser) {
      this.currentUserService.getUserData().subscribe({
        next: (userData) => this.fillForm(userData.data),
        error: (error) => {
          const errorMessage = error?.error?.Message || 'Произошла неизвестная ошибка';
          this.toastService.showError('Ошибка', errorMessage);
        }
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
      inn: userData.inn,
      registerNumber: userData.registerNumber,
      registerNumberBuilder: userData.registerNumberBuilder,
      tgUserName: userData.tgUserName ? `@${userData.tgUserName}` : '@',
      hoursOffset: userData.hoursOffset
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
      return;
    }

    const userUpdateRequest: any = {
      id: this.currentUser.id,
      firstName: this.userProfileForm.value.firstName,
      lastName: this.userProfileForm.value.lastName,
      patronymic: this.userProfileForm.value.patronymic,
      inn: this.userProfileForm.value.inn,
      registerNumber: this.userProfileForm.value.registerNumber,
      registerNumberBuilder: this.userProfileForm.value.registerNumberBuilder,
      hoursOffset: this.userProfileForm.value.hoursOffset,
      roleIds: this.getRoleIds()
    };

    this.currentUserService.updateUserData(userUpdateRequest).subscribe((data: any) => {
      this.currentUserService.getUserData().subscribe({
        next: (data) => {
          this.currentUser = data.data;
          this.currentUserService.saveUser(data.data);
          this.toastService.showSuccess('Успешно', 'Данные пользователя успешно обновлены');
        },
        error: (error) => {
          const errorMessage = error?.error?.Message || 'Произошла неизвестная ошибка';
          this.toastService.showError('Ошибка', errorMessage);
        }
      });
    })
  }

  getRoleIds(): string[] {
    if (!this.currentUser) {
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