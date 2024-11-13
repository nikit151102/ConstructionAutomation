import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExcelViewerComponent } from '../../../components/excel-viewer/excel-viewer.component';
import { CurrentUserService } from '../../../services/current-user.service';
import { PdfViewerComponent } from '../../../components/pdf-viewer/pdf-viewer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ExcelViewerComponent, PdfViewerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private currentUserService: CurrentUserService) { }

  currentUser = ''
  ngOnInit(): void {
    this.currentUserService.getUserData().subscribe({
      next: (data) => {
        this.currentUser = data
      },
      error: (error) => {
        console.error('Ошибка при получении данных пользователя:', error);
      }
    });
  }

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
