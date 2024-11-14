import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { SidebarService } from './sidebar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SidebarModule } from 'primeng/sidebar';
import { PersonalAccountService } from '../../pages/personal-account/personal-account.service';
import { CurrentUserService } from '../../services/current-user.service'
;
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, PanelMenuModule, SidebarModule, ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, AfterViewInit, OnDestroy {
  menuItems: any[] = [
    { label: 'Главная', icon: 'pi pi-home', command: () => this.executeCommand('home') },
    { label: 'Профиль', icon: 'pi pi-user', command: () => this.executeCommand('profile') },
    {
      label: 'Инструменты', icon: 'pi pi-wrench', items: [
        { label: 'Cопоставительная ведомость', command: () => this.executeCommand('comparativeStatement') },
        { label: 'Подкатегория 2', command: 'tool2' }
      ]
    },
    {
      label: 'Документы', icon: 'pi pi-file', items: [
        { label: 'Сопоставительная ведомость', command: 'doc1' },
        { label: 'Подкатегория 2', command: 'doc2' }
      ]
    },
    { label: 'Настройки', icon: 'pi pi-cog', command: () => this.executeCommand('settings') },
    { label: 'Выйти', icon: 'pi pi-sign-out', command: () => this.executeCommand('exit') },
    { label: 'Роли пользователей', icon: '', command: () => this.executeCommand('UserRoles') },
    { label: 'Права доступа', icon: '', command: () => this.executeCommand('UserRolePermission') },
    { label: 'Пользователи', icon: '', command: () => this.executeCommand('Users') },
    
  ];

  
  isSidebarOpen = false;
  isMobileScreen = false;
  darkMode = false;
  submenuState: boolean[] = [];
  private subscriptions: Subscription[] = [];

  constructor(
    public sidebarService: SidebarService,
    private router: Router,
    private personalAccountService: PersonalAccountService,
    private activatedRoute: ActivatedRoute,
    public currentUserService: CurrentUserService
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.sidebarService.isSidebarOpen$.subscribe(state => {
        this.isSidebarOpen = state;
        this.updateSidebarStyles();
      }),
      this.sidebarService.isMobileScreen$.subscribe(isMobile => {
        this.isMobileScreen = isMobile;
      })
    );

    if (!this.currentUserService.currentUser) {
      this.currentUserService.getUserData();
    }
  }

  ngAfterViewInit(): void {
    const navToggle = document.getElementById('nav-toggle') as HTMLInputElement;
    if (navToggle && !navToggle.checked) {
      this.updateSidebarStyles();
    }
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  updateSidebarStyles(): void {
    const styles = this.isSidebarOpen ? { opacity: '1', pointerEvents: 'auto' } : { opacity: '0', pointerEvents: 'none' };
    this.applyStyles('#nav-content .nav-button span, #nav-footer #nav-footer-titlebox, #nav-header #nav-title', styles);
    document.querySelectorAll('#nav-bar a').forEach((el: any) => {
      el.style.width = this.isSidebarOpen ? 'auto' : '35px';
    });

    this.applyStyles('#nav-content', { width: 'auto' });
    if (styles.opacity === '0') {
      this.applyStyles('#nav-header', { width: 'auto' });
    }

  }

  applyStyles(selector: string, styles: { [key: string]: string }): void {
    document.querySelectorAll(selector).forEach((el: any) => {
      Object.assign(el.style, styles);
    });
  }

  toggleSidebar(): void {
    if (this.sidebarService.fixedSlidebar) {
      this.sidebarService.fixedSlidebar = false;
    }
    this.sidebarService.toggleSidebar();
    this.personalAccountService.toggleSidebar();
  }

  executeCommand(commandName: string): void {
    if (commandName === 'exit') {
      localStorage.removeItem('YXV0aFRva2Vu');
      this.router.navigate(['/login']);
    } else {
      this.activatedRoute.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.router.navigate([`${id}/${commandName}`], { replaceUrl: true });
        }
      });
    }
  }

  toggleFixedSidebar() {
    if (this.sidebarService.fixedSlidebar) {
      this.sidebarService.toggleSidebar();
      this.personalAccountService.toggleSidebar();
    }
    this.sidebarService.fixedSlidebar = !this.sidebarService.fixedSlidebar;
  }

  toggleMode(): void {
    this.darkMode = !this.darkMode;
  }

  toggleSubmenu(index: number): void {
    this.submenuState[index] = !this.submenuState[index];
  }

}