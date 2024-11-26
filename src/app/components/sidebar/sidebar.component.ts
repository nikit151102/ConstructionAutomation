import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { SidebarService } from './sidebar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SidebarModule } from 'primeng/sidebar';
import { PersonalAccountService } from '../../pages/personal-account/personal-account.service';
import { CurrentUserService } from '../../services/current-user.service'
import { DocumentsService } from '../../pages/personal-account/documents/documents.service';
import { formConfig } from '../../pages/personal-account/documents/confs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, PanelMenuModule, SidebarModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, AfterViewInit, OnDestroy {
  menuItems: any[] = [
    { label: 'Главная', icon: 'pi pi-home', command: () => this.executeCommand('home') },
    { label: 'Профиль', icon: 'pi pi-user', command: () => this.executeCommand('profile') },
    { label: 'Мои документы', icon: 'pi pi-folder', command: () => this.executeCommand('myDocs') },
    {
      label: 'Документы', icon: 'pi pi-file', items: [
        { label: 'Cопоставительная ведомость', command: () => this.executeDocs('comparativeStatement') },
        { label: 'Спецификация на метериалы', command: () => this.executeDocs('materialSpecification') },
        { label: 'Спецификация работ', command: () => this.executeDocs('workSpecification') }
      ]
    },
    // { label: 'Настройки', icon: 'pi pi-cog', command: () => this.executeCommand('settings') },
    { label: 'Выйти', icon: 'pi pi-sign-out', command: () => this.executeCommand('exit') },
  ];


  isSidebarOpen = true;
  isMobileScreen = false;
  darkMode = false;
  submenuState: boolean[] = [];
  currentUser: any;
  private subscriptions: Subscription[] = [];

  constructor(
    public sidebarService: SidebarService,
    private router: Router,
    private personalAccountService: PersonalAccountService,
    private activatedRoute: ActivatedRoute,
    public currentUserService: CurrentUserService,
    private documentsService: DocumentsService
  ) { }

  ngOnInit(): void {
    this.updateSidebarStyles();
    this.subscriptions.push(
      this.sidebarService.isSidebarOpen$.subscribe(state => {
        this.isSidebarOpen = state;
        this.updateSidebarStyles();
      }),
      this.sidebarService.isMobileScreen$.subscribe(isMobile => {
        this.isMobileScreen = isMobile;
      })
    );

    if (!this.currentUserService.hasUser()) {
      this.currentUserService.getUserData().subscribe({
        next: (userData) => {
          this.currentUser = userData;
        },
        error: (err) => {
          console.error('Ошибка при загрузке данных пользователя:', err);
        },
      });
    } else {
      this.currentUser = this.currentUserService.getUser();
    }


  }

  ngAfterViewInit(): void {
    const navToggle = document.getElementById('nav-toggle') as HTMLInputElement;
    if (navToggle && !navToggle.checked) {
      this.updateSidebarStyles();
      this.sidebarService.toggleSidebar();
    }
  }

  executeDocs(commandName: string) {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.documentsService.setSelectConfValue(formConfig);
        this.router.navigate([`${id}/${commandName}`], { replaceUrl: true });
      }
    });
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

    if (!this.sidebarService.fixedSlidebar && this.isSidebarOpen) {
      this.toggleSidebar();

      document.querySelectorAll('#nav-header label .pi-chevron-left').forEach((el: any) => {
        Object.assign(el.style, { transform: 'rotate(0deg)' });
      });
    }
  }

  toggleFixedSidebar() {
    if (this.sidebarService.fixedSlidebar) {
      this.sidebarService.toggleSidebar();
      this.personalAccountService.toggleSidebar();
      document.querySelectorAll('#nav-header label .pi-chevron-left').forEach((el: any) => {
        Object.assign(el.style, { transform: 'rotate(180deg)' });
      });
    }
    this.sidebarService.fixedSlidebar = !this.sidebarService.fixedSlidebar;
  }

  toggleMode(): void {
    this.darkMode = !this.darkMode;
  }

  toggleSubmenu(index: number): void {
    this.submenuState[index] = !this.submenuState[index];
  }

  ngOnDestroy(): void {
    this.sidebarService.closedSidebar();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}