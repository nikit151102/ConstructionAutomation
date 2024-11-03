import { Component, AfterViewInit, OnDestroy, OnInit, Input } from '@angular/core';
import { PopUpEntryService } from './pop-up-entry.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from '../../../services/token.service';
import { environment } from '../../../../environment';
import { FormAuthorizationService } from '../form-authorization/form-authorization.service';
import { FormRegistrationService } from '../form-registration/form-registration.service';

@Component({
  selector: 'app-pop-up-entry',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, InputTextModule],
  templateUrl: './pop-up-entry.component.html',
  styleUrls: ['./pop-up-entry.component.css']
})
export class PopUpEntryComponent implements AfterViewInit, OnDestroy, OnInit {

  constructor(
    public popUpEntryService: PopUpEntryService,
    private tokenService: TokenService,
    private http: HttpClient,
    private router: Router,
    private formAuthorizationService: FormAuthorizationService,
    private formRegistrationService: FormRegistrationService
  ) { }

  @Input() type: string = ''

  telegramWidgetLoaded: boolean = false;
  userAuthenticated: boolean = false;
  ngAfterViewInit() {
    if (this.popUpEntryService.visible) {
      this.loadTelegramWidget();
    }
  }
  ngOnInit() {
    // this.loadTelegramWidget()
  }

  ngOnDestroy() {
    this.telegramWidgetLoaded = false;
    this.removeTelegramWidget();
  }

  loadTelegramWidget() {
    if (!document.getElementById('telegram-widget-script')) {
      const script = document.createElement('script');
      script.id = 'telegram-widget-script';
      script.async = true;
      script.src = 'https://telegram.org/js/telegram-widget.js?22';
      script.setAttribute('data-telegram-login', `${environment.userNameBot}`);
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-onauth', 'onTelegramAuth(user)');
      script.setAttribute('data-request-access', 'write');

      document.getElementById('telegram-login')?.appendChild(script);

      // Ensure onTelegramAuth is available globally
      (window as any).onTelegramAuth = this.onTelegramAuth.bind(this);
      this.telegramWidgetLoaded = true;
    }
  }



  removeTelegramWidget() {
    const script = document.getElementById('telegram-widget-script');
    if (script) {
      script.remove();
    }
    (window as any).onTelegramAuth = undefined;
    this.telegramWidgetLoaded = false;
  }

  onTelegramAuth(user: any) {
    let Data;

    if (this.type == 'authorization') {
      Data = {
        UserName: user.username,
        Hash: user.hash,
        Email: '',
        Password: '',
      };
      this.formAuthorizationService.signIn(Data).subscribe((response: any) => {
        console.log('Успешный вход:', response);
        this.tokenService.setToken(response.token);
        this.userAuthenticated = true;
      });
    } else {
      Data = {
        FirstName: '',
        LastName: '',
        Hash: user.hash,
        UserName: user.username,
        Email: '',
        Password: '',
        Roles: []
      };
      this.formRegistrationService.signUn(Data).subscribe((response: any) => {
        console.log('Успешная регистрация:', response);
        this.tokenService.setToken(response.token);
        this.userAuthenticated = true;
      });
    }


  }


  login_enter() {
    this.popUpEntryService.visible = false;

    this.popUpEntryService.getRoot().subscribe(
      (data) => {
        this.tokenService.setToken(data.token);
        console.log('User data:', data.token);
        this.popUpEntryService.userVisible = true;
        this.popUpEntryService.visible = false;
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );

  }




  closePopUp() {
    this.popUpEntryService.visible = false;
    this.telegramWidgetLoaded = false;
    this.removeTelegramWidget();
  }

  clearCookies() {
    const cookies = document.cookie.split(';');

    // Loop through the cookies and delete each one
    for (let cookie of cookies) {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      // Setting the cookie expiration date to the past will delete it
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }
  }

}
