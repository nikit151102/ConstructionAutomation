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

  constructor(private myDocumentsService: MyDocumentsService, public fileService: FileService) {

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
    this.myDocumentsService.deleteFile(id).subscribe((data: any) => {
      console.log("deletFile")
      this.myDocumentsService.loadData();
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
    this.myDocumentsService.renameFile(this.file.id, data).subscribe((data: any) => {
      console.log("renameFile");
      this.closeDialogRename();
      this.myDocumentsService.loadData();
    });
  }

  downloadFile(fileId: string) {
    this.myDocumentsService.downloadFile(fileId).subscribe((data: Blob) => {
      console.log("data", data)
      const fileName = this.file.fileName || 'downloaded-file';
      const downloadUrl = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      link.click();

      window.URL.revokeObjectURL(downloadUrl);
    }, error => {
      console.error('Ошибка при скачивании файла:', error);
    });
  }


}