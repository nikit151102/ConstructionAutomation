import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MyDocumentsService } from '../my-documents.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';
import { FileService } from './file.service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-file',
  standalone: true,
  imports: [CommonModule, FormsModule, ContextMenuModule, DialogModule, ButtonModule, InputTextModule, TooltipModule],
  templateUrl: './file.component.html',
  styleUrl: './file.component.scss'
})
export class FileComponent implements OnInit {

  @Input() file!: any;
  @Input() isdelete: boolean = false;
  @Output() folderClick = new EventEmitter<void>();
  @ViewChild('cm') contextMenu!: ContextMenu;
  value!: string;
  contextMenuItems: MenuItem[] = [
    {
      label: 'Скачать',
      icon: 'pi pi-download',
      command: () => this.downloadFile(this.file.id),
    },
    {
      label: 'Переименовать',
      icon: 'pi pi-pencil',
      command: () => this.openDialogRename(),
    },
    {
      label: 'Удалить',
      icon: 'pi pi-trash',
      command: () => this.deleteFile(this.file.id),
    },
  ];

  constructor(private myDocumentsService: MyDocumentsService, public fileService: FileService, private toastService: ToastService) {

  }

  isVertical: boolean = false;
  ngOnInit(): void {
    this.myDocumentsService.isVertical$.subscribe((type: boolean) => {
      this.isVertical = type;
    })
  }

  onRightClick(event: MouseEvent, file: any) {
    this.file = file;
    event.preventDefault();
    this.fileService.setMenu(this.contextMenu);
    this.contextMenu.show(event);
  }


  handleClick() {
    if (this.file.isFolder) {
      this.folderClick.emit();
    }
  }

  deleteFile(id: string) {
    this.myDocumentsService.deleteFile(id).subscribe(
      (data: any) => {
        this.myDocumentsService.loadData();
        this.toastService.showSuccess('Успешно!', 'Операция выполнена успешно');
      },
      (error: any) => {
        console.error('Ошибка при удалении файла:', error);
        this.toastService.showError('Ошибка!', 'Не удалось удалить файл');
      }
    );
  }

  openDialogRename() {
    this.fileService.visibleShonRename = true;
  }

  closeDialogRename() {
    this.fileService.visibleShonRename = true;
    this.value = '';
  }

  renameFile() {
    let data = {
      Id: this.file.id,
      Name: this.value
    }
    this.myDocumentsService.renameFile(this.file.id, data).subscribe(
      (data: any) => {
        this.closeDialogRename();
        this.myDocumentsService.loadData();
        this.toastService.showSuccess('Успех!', 'Файл переименован');
      },
      (error: any) => {
        console.error('Ошибка при переименовании файла:', error);
        this.toastService.showError('Ошибка!', 'Не удалось переименовать файл');
      }
    );
  }

  downloadFile(fileId: string) {
    this.myDocumentsService.downloadFile(fileId).subscribe((data: Blob) => {
      console.log('Received data:', data);
  
      // Проверка типа контента
      const contentType = data.type;
      console.log('Content Type:', contentType);
  
      // Преобразование Blob в URL
      const downloadUrl = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = this.file.fileName || 'downloaded-file';
      link.click();
  
      // Очистка URL после скачивания
      window.URL.revokeObjectURL(downloadUrl);
    }, error => {
      console.error('Ошибка при скачивании файла:', error);
      this.toastService.showError('Ошибка!', 'Не удалось скачать файл');
    });
  }
  


}