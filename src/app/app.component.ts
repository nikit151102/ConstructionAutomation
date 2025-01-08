import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerComponent } from './components/progress-spinner/progress-spinner.component';
import { ProgressSpinnerService } from './components/progress-spinner/progress-spinner.service';
import { CommonModule } from '@angular/common';
import { CookieConsentComponent } from './components/cookie-consent/cookie-consent.component';
import { CookieConsentService } from './services/cookie-consent.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToastModule, ProgressSpinnerComponent, CookieConsentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  isLoading: boolean = false;
  constructor(public spinnerService: ProgressSpinnerService,
    private cdr: ChangeDetectorRef,
    private cookieConsentService:CookieConsentService
  ) {}

  ngOnInit(): void {
    this.spinnerService.isLoading$.subscribe(data => {
      this.isLoading = data
      this.cdr.detectChanges(); 
    })

    const key = 'Y29va2llQ29uc2VudA==';
    const consent = localStorage.getItem(key);
    
    if (!consent || consent === 'false') {
      localStorage.setItem(key, 'false');
      this.cookieConsentService.openConsent();
    } else if(consent === 'true'){
      this.cookieConsentService.closeConsent();
    }
    

  }


}
