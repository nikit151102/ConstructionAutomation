import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
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
      icon: 'pi pi-folder-open',
      command: () => this.openFolder(),
    },
    {
      label: 'Переименовать',
      icon: 'pi pi-pencil',
      command: () => this.openDialogRename(this.folder.name),
    },
    {
      label: 'Переместить',
      icon: 'pi pi-arrow-right',
      command: () => this.moveFolder(this.folder),
    },
    {
      label: 'Удалить',
      icon: 'pi pi-trash',
      command: () => this.deleteFolder(this.folder.id),
    },
  ];

  constructor(private myDocumentsService: MyDocumentsService,
    private toastService: ToastService,
    public folderService: FolderService) { }


  moveFolder(folder: any) {
    this.moveDirectory = folder;
    this.myDocumentsService.setMoveDirectory(folder);
  }

  isVertical: boolean = false;


  updateContextMenu(): void {
    if (this.moveFile || this.moveDirectory) {
      this.contextMenuItems.push({
        label: 'Вставить',
        icon: 'pi pi-clipboard',
        command: () => this.pasteItem(),
      });
    } else {
      this.contextMenuItems = this.contextMenuItems.filter(item => item.label !== 'Вставить');
    }
  }

  pasteItem(): void {
    if (this.moveDirectory) {
      const folder = this.moveDirectory;
      this.myDocumentsService.handleFolderMove(folder.id, this.folder.id, this.folder.id)
      this.moveDirectory = null;
    }
    else if (this.moveFile) {
      const file = this.moveFile;
      this.myDocumentsService.handleFileMove(file.id, this.folder.id, this.folder.id)
      this.moveFile = null;
    }
  }

  ngOnInit(): void {
    this.updateContextMenu();
    this.subscribeToMoveEvents();
    this.myDocumentsService.isVertical$.subscribe((type: boolean) => {
      this.isVertical = type;
    })
  }

  moveFile: any;
  moveDirectory: any;
  subscribeToMoveEvents(): void {
    this.myDocumentsService.moveFileObservable.subscribe((file) => {
      this.moveFile = file;
      this.updateContextMenu();
    });

    this.myDocumentsService.moveDirectoryObservable.subscribe((directory) => {
      this.moveDirectory = directory;
      this.updateContextMenu();
    });
  }

  openFolder() {
    if (!this.visibleShonRename)
      this.myDocumentsService.loadData(this.folder.id)
  }

  onEnter(): void {
    this.applyRename();
  }

  onEsc(): void {
    this.cancelRename();
  }

  applyRename(): void {
    // Логика для подтверждения ввода
    console.log('Rename applied:', this.value);
    const data = {
      "id": this.folder.id,
      "name": this.value
    }
    this.folderService.renameFolder(this.folder.id, data).subscribe((data: any) => {
      console.log('data', data)
      this.folder = { ...data.data, icon: data.data.type === 'file' ? 'pngs/file.png' : data.data.type === "directory" ? 'pngs/folder.png' : '' }
    })
    this.visibleShonRename = false;
  }

  cancelRename(): void {
    this.value = ''; 
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
    this.folderService.deleteFolder(this.folder.id).subscribe(
      (data: any) => {
        const idFolder = this.myDocumentsService.BreadcrumbItems.length > 0
          ? this.myDocumentsService.BreadcrumbItems[this.myDocumentsService.BreadcrumbItems.length - 1]['idFolder'] ?? ""
          : "";
        this.myDocumentsService.loadData(idFolder);

        this.toastService.showSuccess('Успешно!', 'Операция выполнена успешно');
      },
      (error: any) => {
        this.toastService.showError('Ошибка!', 'Не удалось удалить файл');
      }
    );
  }

  openDialogRename(fileName: string) {
    this.visibleShonRename = true;
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
        this.toastService.showError('Ошибка!', 'Не удалось переименовать файл');
      }
    );
  }

}