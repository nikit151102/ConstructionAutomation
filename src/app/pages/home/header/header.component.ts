import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  isMenuActive = false;

  constructor(private router: Router) {}

  toggleMenu(): void {
    this.isMenuActive = !this.isMenuActive;
  }

  navigateTo(section: string): void {
    const element = document.querySelector(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center'});
    }
  }


}
