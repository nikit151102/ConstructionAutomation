import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';

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
  userProfileForm!: FormGroup;
  avatarPreviewUrl: string | null = null;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.userProfileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      patronymic: [''],
      email: ['', [Validators.required, Validators.email]],
      tgUserName: ['@', [Validators.required]],
      avatar: [null],
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

  onSubmit() {
    if (this.userProfileForm.valid) {
      console.log(this.userProfileForm.value);
    } else {
      this.userProfileForm.markAllAsTouched();
    }
  }

  get formControls() {
    return this.userProfileForm.controls;
  }
}