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
      command: () => this.openFolder(),
    },
    {
      label: 'Переименовать',
      icon: 'pi pi-pencil',
      command: () => this.openDialogRename(this.folder.name),
    },
    // {
    //   label: 'Свойство',
    //   icon: 'pi pi-exclamation-circle',
    //   // command: () => this.openDialogRename(this.folder.fileName),
    // },
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


  openFolder(){
    if(!this.visibleShonRename)
    this.myDocumentsService.loadData(this.folder.id)
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
    const data = {
      "id": this.folder.id,
      "name": this.value
    }
    this.folderService.renameFolder(this.folder.id,data ).subscribe((data: any) => {
      console.log('data', data)
      this.folder = {...data.data, icon: data.data.type === 'file' ? 'pngs/file.png' : data.data.type === "directory" ? 'pngs/folder.png' : ''}
    })
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
    console.log('this.folder',this.folder)
    this.folderService.deleteFolder(this.folder.id).subscribe(
      (data: any) => {
        const idFolder = this.myDocumentsService.BreadcrumbItems.length > 0
        ? this.myDocumentsService.BreadcrumbItems[this.myDocumentsService.BreadcrumbItems.length - 1]['idFolder'] ?? ""
        : "";
        this.myDocumentsService.loadData(idFolder);
        
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
        const idFolder = this.myDocumentsService.BreadcrumbItems.length > 0
        ? this.myDocumentsService.BreadcrumbItems[this.myDocumentsService.BreadcrumbItems.length - 1]['idFolder'] ?? ""
        : "";
        this.myDocumentsService.loadData(idFolder);
        this.toastService.showSuccess('Успех!', 'Файл переименован');
      },
      (error: any) => {
        console.error('Ошибка при переименовании файла:', error);
        this.toastService.showError('Ошибка!', 'Не удалось переименовать файл');
      }
    );
  }

}