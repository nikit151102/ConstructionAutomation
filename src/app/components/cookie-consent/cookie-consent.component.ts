import { Component, OnInit } from '@angular/core';
import { CookieConsentService } from '../../services/cookie-consent.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cookie-consent.component.html',
  styleUrl: './cookie-consent.component.scss'
})
export class CookieConsentComponent implements OnInit {

  showCookieBanner: boolean = false;
  private consentSubscription: Subscription = Subscription.EMPTY;

  constructor(private cookieConsentService: CookieConsentService) { }

  ngOnInit(): void {
    this.consentSubscription = this.cookieConsentService.consentStatus$.subscribe(consentGiven => {
      this.showCookieBanner = consentGiven; 
    });
  }

  acceptCookies(): void {
    this.cookieConsentService.giveConsent();  
    this.showCookieBanner = false;  
  }

  rejectCookies(): void {
    this.cookieConsentService.revokeConsent(); 
    this.showCookieBanner = false;  
  }
}