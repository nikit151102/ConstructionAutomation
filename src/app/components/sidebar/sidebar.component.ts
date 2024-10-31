import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SidebarService } from './sidebar.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SliderModule } from 'primeng/slider';
import { SidebarModule } from 'primeng/sidebar';

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
    label: 'Выйти', icon: 'pi pi-sign-out', command: () => this.executeCommand('exit')
  }
];

  isSidebarOpen: boolean = false;
  isSidebarPinned: boolean = false;

  constructor(public sidebarService: SidebarService, private router: Router) {

  }

  ngOnInit(): void {
    this.sidebarService.isSidebarOpen$.subscribe((isOpen) => {
      this.isSidebarOpen = isOpen;
    });
  
    if (window.innerWidth > 1200) {
      this.sidebarService.toggleSidebar();
      setTimeout(() => {
        this.togglePinSidebar();
      });
    }
  }

  hideSiderBar(){
    this.togglePinSidebar();
  }

  togglePinSidebar() {
    if(this.isSidebarPinned === true){
      this.isSidebarPinned = !this.isSidebarPinned;
      this.sidebarService.toggleSidebar();
    }else{
      this.isSidebarPinned = !this.isSidebarPinned;
      const sidebar = document.querySelector('.p-component-overlay') as HTMLElement;
      if (sidebar) {
          sidebar.style.width = this.isSidebarPinned ? `0px` : '100%';
          sidebar.classList.toggle('pinned', this.isSidebarPinned);
      }
    }
}

  executeCommand(item: string) {
    console.log("item", item)
    if (item === 'exit') {
      localStorage.removeItem('YXV0aEFkbWluVG9rZW4=');
      localStorage.removeItem('idAdmin');
      this.router.navigate(['/'])
    } else {
      console.log(localStorage.getItem('YXV0aEFkbWluVG9rZW4='));
      this.router.navigate([`/admin/${localStorage.getItem('YXV0aEFkbWluVG9rZW4=')}/${item}`]);
    }
  }

}