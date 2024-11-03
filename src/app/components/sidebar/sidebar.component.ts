import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SidebarService } from './sidebar.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SliderModule } from 'primeng/slider';
import { SidebarModule } from 'primeng/sidebar';
import { PersonalAccountService } from '../../pages/personal-account/personal-account.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, PanelMenuModule, SidebarModule ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

menuItems: any[] = [
  {
    label: 'Главная', icon: 'pi pi-home', command: () => this.executeCommand('home')
  },
  {
    label: 'Профиль', icon: 'pi pi-cog', command: () => this.executeCommand('skills')
  },
  {
    label: 'Инструменты', icon: 'pi pi-users',
    items: [
      {
        label: 'Подкатегория 1', icon: 'pi pi-wrench', command: () => this.executeCommand('tool1')
      },
      {
        label: 'Подкатегория 2', icon: 'pi pi-briefcase', command: () => this.executeCommand('tool2')
      }
    ]
  },
  {
    label: 'Документы', icon: 'pi pi-file',
    items: [
      {
        label: 'Подкатегория 1', icon: 'pi pi-folder', command: () => this.executeCommand('doc1')
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

  isSidebarOpen: boolean = false;
  isSidebarPinned: boolean = false;

  constructor(public sidebarService: SidebarService, private router: Router, public personalAccountService: PersonalAccountService) {

  }
  ngOnInit(): void {
  }

 
  isSubMenuOpen: { [key: string]: boolean } = {};

  executeCommand(commandName: string) {
    console.log(`Executing command: ${commandName}`);
    if (commandName === 'togglePin') {
      this.togglePinSidebar();
    }
    // Реализация логики для других команд
  }

  exitCommand(commandName: string) {
    if (commandName === 'exit') {
      localStorage.removeItem('YXV0aFRva2Vu');
      this.router.navigate([`/login`]);
    }
  }

  togglePinSidebar() {
    console.log('Toggling sidebar pin');
  }

  toggleSubMenu(label: string) {
    this.isSubMenuOpen[label] = !this.isSubMenuOpen[label];
  }
}