import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CustomButtonComponent } from '../../../ui-kit/custom-button/custom-button.component';
import { FormAuthorizationService } from './form-authorization.service';
import { Router } from '@angular/router';
import { TokenService } from '../../../services/token.service';
import { PopUpEntryComponent } from '../pop-up-entry/pop-up-entry.component';
import { ToastService } from '../../../services/toast.service';
import { CookieConsentService } from '../../../services/cookie-consent.service';
import { CustomInputComponent } from '../../../ui-kit/custom-input/custom-input.component';
import { ProgressSpinnerService } from '../../../components/progress-spinner/progress-spinner.service';

@Component({
  selector: 'app-form-authorization',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CustomButtonComponent, PopUpEntryComponent, CustomInputComponent],
  templateUrl: './form-authorization.component.html',
  styleUrls: ['./form-authorization.component.scss']
})
export class FormAuthorizationComponent implements OnInit {
  @Output() visibleBtns: EventEmitter<boolean> = new EventEmitter<boolean>();

  signInForm: FormGroup;
  currentUser: boolean = false;
  dataCurrentUser: any;
  private localStorageKey: string = 'ZW5jcnlwdGVkRW1haWw=';
  public isMenuVisible: boolean = false;

  constructor(private fb: FormBuilder,
    private AuthorizationService: FormAuthorizationService,
    private router: Router,
    private tokenService: TokenService,
    private progressSpinnerService: ProgressSpinnerService,
    private toastService: ToastService,
    private cookieConsentService: CookieConsentService
  ) {
    this.signInForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  private safeBtoa(input: string): string {
    return btoa(unescape(encodeURIComponent(input)));
  }

  private safeAtob(input: string): string {
    return decodeURIComponent(escape(atob(input)));
  }

  ngOnInit() {
    const encryptedEmail = localStorage.getItem(this.localStorageKey);
    if (encryptedEmail) {
      this.dataCurrentUser = JSON.parse(this.safeAtob(encryptedEmail));
      this.signInForm.patchValue({ username: this.dataCurrentUser.email });
      this.currentUser = true;
      this.visibleBtns.emit(false);
    }

    setTimeout(() => {
      const usernameInput = document.getElementById('username') as HTMLInputElement;
      const passwordInput = document.getElementById('password') as HTMLInputElement;

      if (usernameInput) {
        usernameInput.type = 'text';
        setTimeout(() => usernameInput.type = 'text', 100);
      }

      if (passwordInput) {
        passwordInput.type = 'text';
        setTimeout(() => passwordInput.type = 'password', 100);
      }
    });
  }

  goBack(): void {
    this.router.navigateByUrl('/');
  }

  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }

  hideProfile() {
    this.signInForm.patchValue({ username: '' });
    localStorage.removeItem(this.localStorageKey);
    this.currentUser = false;
    this.visibleBtns.emit(true);
    this.isMenuVisible = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const menuElement = document.querySelector('.dropdownMenu');
    if (menuElement && !menuElement.contains(event.target as Node)) {
      this.isMenuVisible = false;
    }
  }

  onSignIn() {
    this.signInForm.markAllAsTouched();

    if (this.signInForm.valid) {

      if (!this.cookieConsentService.hasConsented()) {
        this.cookieConsentService.revokeConsent();
        this.toastService.showWarn('Предупреждение', 'Вы должны согласиться на использование cookie');
        this.cookieConsentService.openConsent()
        return;
      }

      this.progressSpinnerService.show();

      const formData = this.signInForm.value;

      const Data = {
        UserName: formData.username,
        Email: formData.username,
        Password: formData.password,
      };

      this.AuthorizationService.signIn(Data).subscribe(
        (response) => {
          if (response.data) {
            this.tokenService.setToken(response.data.token);
            this.progressSpinnerService.hide(); 
            this.router.navigate([`/${response.data.id}`]);
            localStorage.setItem('VXNlcklk', response.data.id);
          }
        },
        (error) => {
          this.progressSpinnerService.hide();
          const errorMessage = error?.error?.Message || 'Произошла неизвестная ошибка';
          this.toastService.showError('Ошибка', errorMessage);
        }
      );
    } else {
      this.toastService.showWarn('Предупреждение', 'Форма невалидна')
    }
  }


  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSignIn();
    }
  }

}
