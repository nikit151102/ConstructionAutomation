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
import { CommomFileService} from '../../../../services/file.service';

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
      command: () => this.openDialogRename(this.file.fileName),
    },
    {
      label: 'Удалить',
      icon: 'pi pi-trash',
      command: () => this.deleteFile(this.file.id),
    },
  ];

  constructor(private myDocumentsService: MyDocumentsService, public fileService: FileService, private toastService: ToastService, private commomFileService:CommomFileService) {

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

  openDialogRename(fileName: string) {
    this.fileService.visibleShonRename = true;
    console.log('fileName',fileName)
    this.value = fileName
  }

  closeDialogRename() {
    this.fileService.visibleShonRename = false;
    this.value = '';
  }

  renameFile() {
    let data = {
      Id: this.file.id,
      FileName: this.value
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

  downloadFile(fileId: string) {
    this.commomFileService.downloadFile(fileId);
  }



}