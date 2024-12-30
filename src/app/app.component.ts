import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ToastService } from './services/toast.service';
import { ProgressSpinnerComponent } from './components/progress-spinner/progress-spinner.component';
import { ProgressSpinnerService } from './components/progress-spinner/progress-spinner.service';
import { CommonModule } from '@angular/common';
import { CookieConsentComponent } from './components/cookie-consent/cookie-consent.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToastModule, ProgressSpinnerComponent, CookieConsentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  title = 'ConstructionAutomation';
  isLoading: boolean = false;
  constructor(public spinnerService: ProgressSpinnerService,
    private cdr: ChangeDetectorRef
  ) {


  }

  ngOnInit(): void {
    this.spinnerService.isLoading$.subscribe(data => {
      this.isLoading = data
      this.cdr.detectChanges(); 
    })
  }


}
