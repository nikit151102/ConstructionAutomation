import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {


  constructor(private router: Router) {}

  goToLogin(): void {
    this.router.navigate(['/login']);
  }


  goToLegal(): void {
    this.router.navigate(['/legal/82913']);
  }
  
}
