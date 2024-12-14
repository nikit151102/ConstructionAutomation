import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { MyDocumentsService } from '../my-documents.service';
import { MenuItem } from 'primeng/api';
import { CommomFileService } from '../../../../services/file.service';
import { ToastService } from '../../../../services/toast.service';
import { FileService } from '../file/file.service';
import { FolderService } from './folder.service';

@Component({
  selector: 'app-folder',
  standalone: true,
  imports: [CommonModule, FormsModule, ContextMenuModule, DialogModule, ButtonModule, InputTextModule, TooltipModule],
  templateUrl: './folder.component.html',
  styleUrl: './folder.component.scss'
})
export class FolderComponent implements OnInit {

  @Input() folder!: any;
  @Input() isdelete: boolean = false;
  @Output() folderClick = new EventEmitter<void>();
  @ViewChild('cm') contextMenu!: ContextMenu;
  visibleShonRename: boolean = false;
  value!: string;
  @ViewChild('renameInput', { static: false }) renameInput!: ElementRef;
  contextMenuItems: MenuItem[] = [
    {
      label: 'Открыть',
      icon: 'pi pi-pencil',
      command: () => this.openDialog(this.folder.id),
    },
    {
      label: 'Переименовать',
      icon: 'pi pi-pencil',
      command: () => this.openDialogRename(this.folder.name),
    },
    {
      label: 'Свойство',
      icon: 'pi pi-exclamation-circle',
      // command: () => this.openDialogRename(this.folder.fileName),
    },
    {
      label: 'Удалить',
      icon: 'pi pi-trash',
      command: () => this.deleteFolder(this.folder.id),
    },
  ];

  constructor(private myDocumentsService: MyDocumentsService, private toastService: ToastService, private commomFileService: CommomFileService, public folderService: FolderService) {

  }

  isVertical: boolean = false;
  ngOnInit(): void {
    this.myDocumentsService.isVertical$.subscribe((type: boolean) => {
      this.isVertical = type;
    })
  }


  openDialog(IdFolder: string){
    this.folderService.openFolder(IdFolder).subscribe((data: any) => {
      const combinedArray = [
        ...(data.data.subDirectories || []), 
        ...(data.data.documents || [])
      ];
      this.myDocumentsService.setFiles(combinedArray)
    })
  }

  transitionFolder() {
    this.folderService.transitionFolder(this.folder.id).subscribe((response: any)=>{
      const combinedArray = [
        ...(response.data.subDirectories || []).map((item:any) => ({ ...item, source: 'subDirectory' })),
        ...(response.data.documents || []).map((item:any) => ({ ...item, source: 'document' }))
      ];
      this.myDocumentsService.setFiles(combinedArray);
    })
  }

  onEnter(): void {
    console.log('Enter key pressed:', this.value);
    this.applyRename();
  }

  onEsc(): void {
    console.log('Escape key pressed');
    this.cancelRename();
  }

  applyRename(): void {
    // Логика для подтверждения ввода
    console.log('Rename applied:', this.value);

    this.visibleShonRename = false;
  }

  cancelRename(): void {
    // Логика для отмены ввода
    console.log('Rename canceled');
    this.value = ''; // Очистить поле или вернуть предыдущее значение
    this.visibleShonRename = false;
  }



  onRightClick(event: MouseEvent, file: any) {
    this.folder = file;
    event.preventDefault();
    this.folderService.setMenu(this.contextMenu);
    this.contextMenu.show(event);
  }


  handleClick() {
    if (this.folder.isFolder) {
      this.folderClick.emit();
    }
  }

  deleteFolder(id: string) {
    this.folderService.deleteFolder(id).subscribe(
      (data: any) => {
        // this.myDocumentsService.loadData();
        this.toastService.showSuccess('Успешно!', 'Операция выполнена успешно');
      },
      (error: any) => {
        console.error('Ошибка при удалении файла:', error);
        this.toastService.showError('Ошибка!', 'Не удалось удалить файл');
      }
    );
  }

  openDialogRename(fileName: string) {
    this.visibleShonRename = true;
    console.log('fileName', fileName)
    this.value = fileName
  }

  closeDialogRename() {
    this.visibleShonRename = false;
    this.value = '';
  }

  renameFile() {
    let data = {
      Id: this.folder.id,
      FileName: this.value
    }
    this.folderService.renameFolder(this.folder.id, data).subscribe(
      (data: any) => {
        this.closeDialogRename();
        // const userId = this.currentUserService.getUser();
        // this.myDocumentsService.loadData(userId.id);
        this.toastService.showSuccess('Успех!', 'Файл переименован');
      },
      (error: any) => {
        console.error('Ошибка при переименовании файла:', error);
        this.toastService.showError('Ошибка!', 'Не удалось переименовать файл');
      }
    );
  }

  private createBlobFromData(fileData: any): Blob {
    if (!fileData.fileContents) {
      console.error('Отсутствуют данные файла для преобразования в Blob.');
      return new Blob(); // Возвращаем пустой Blob, если данных нет.
    }

    const byteCharacters = atob(fileData.fileContents); // Декодируем base64
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      byteArrays.push(new Uint8Array(byteNumbers));
    }

    return new Blob(byteArrays, { type: fileData.contentType });
  }



}