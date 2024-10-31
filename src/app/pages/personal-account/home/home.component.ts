import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CompStatementComponent } from '../../../components/comp-statement/comp-statement.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CompStatementComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(private router: Router){}
  
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
      label: 'Выйти', icon: 'pi pi-sign-out', command: () => this.executeCommand('exit')
    }
  ];

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
