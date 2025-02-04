import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../../services/token.service';
import { CommonModule } from '@angular/common';
import { CurrentUserService } from '../../../services/current-user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  isMenuActive = false;
  userId: string = '';

  constructor(private router: Router, public tokenService: TokenService, private currentUserService: CurrentUserService,
    private cdr: ChangeDetectorRef
  ) {
    if (this.currentUserService.hasUser()) {
      this.setUserId();
    } else if (this.tokenService.hasToken()) {

      this.currentUserService.getDataUser().subscribe((value: any) => {
        this.currentUserService.saveUser(value.data)
        this.setUserId();
      });

    } else {
      this.userId = '';
    }

  }

  ngOnInit(): void {

  }

  private setUserId(): void {
    this.userId = this.currentUserService.hasUser()
      ? this.currentUserService.getUser().id
      : '';
  }


  toggleMenu(): void {
    this.isMenuActive = !this.isMenuActive;
  }

  navigateTo(section: string): void {
    const element = document.querySelector(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    this.isMenuActive = false;
  }

  goToLogin(): void {
    this.router.navigate(['/login'], { state: { isSessionExpired: false } });
  }

  goToContacts(): void {
    this.router.navigate(['/contacts']);
  }

  goToProfile() {
    if (this.userId && this.userId.length > 0) {
      this.router.navigate([`/${this.userId}`]);
    } else {
      this.userId = '';
    }
  }

  @HostListener('document:click', ['$event'])
  closeMenu(event: MouseEvent): void {
    const menuElement = document.querySelector('.menu');
    if (menuElement && !menuElement.contains(event.target as Node)) {
      this.isMenuActive = false;
    }
  }

}
