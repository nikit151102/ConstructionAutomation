import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SidebarService } from './sidebar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SliderModule } from 'primeng/slider';
import { SidebarModule } from 'primeng/sidebar';
import { PersonalAccountService } from '../../pages/personal-account/personal-account.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, PanelMenuModule, SidebarModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  menuItems: any[] = [
    {
      label: 'Главная', icon: 'pi pi-home', command: () => this.executeCommand('/home')
    },
    {
      label: 'Профиль', icon: 'pi pi-cog', command: () => this.executeCommand('/profile')
    },
    {
      label: 'Инструменты', icon: 'pi pi-users',
      items: [
        {
          label: 'Cопоставительная ведомость', icon: '', command: () => this.executeCommand('comparativeStatement')
        },
        {
          label: 'Подкатегория 2', icon: '', command: () => this.executeCommand('tool2')
        }
      ]
    },
    {
      label: 'Документы', icon: 'pi pi-file',
      items: [
        {
          label: 'Сопоставительная ведомость', icon: 'pi pi-folder', command: () => this.executeCommand('doc1')
        },
        {
          label: 'Подкатегория 2', icon: 'pi pi-file-pdf', command: () => this.executeCommand('doc2')
        }
      ]
    },
    {
      label: 'Настройки', icon: 'pi pi-book', command: () => this.executeCommand('specialties')
    },
    {
      label: 'Закрепить меню', icon: 'pi pi-pin', command: () => this.togglePinSidebar()
    },
    {
      label: 'Выйти', icon: 'pi pi-sign-out', command: () => this.exitCommand('exit')
    }
  ];

  constructor(public sidebarService: SidebarService, private router: Router, private activatedRoute: ActivatedRoute, public personalAccountService: PersonalAccountService) {

  }

  ngOnInit(): void { }

  executeCommand(commandName: string) {
    if (commandName === 'togglePin') {
      this.togglePinSidebar();
    } else {
      this.activatedRoute.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.router.navigate([`${id}/${commandName}`], { replaceUrl: true });
        }
      });
    }
  }

  exitCommand(commandName: string) {
    if (commandName === 'exit') {
      localStorage.removeItem('YXV0aFRva2Vu');
      this.router.navigate([`/login`]);
    }
  }

  togglePinSidebar() {
  }


  darkMode = false;


  expandSidebar() {
    this.sidebarService.isSidebarClosed = false;
  }

  toggleMode() {
    this.darkMode = !this.darkMode;
  }

  submenuState: boolean[] = [];

  toggleSubmenu(index: number) {
    this.submenuState[index] = !this.submenuState[index];
  }

}