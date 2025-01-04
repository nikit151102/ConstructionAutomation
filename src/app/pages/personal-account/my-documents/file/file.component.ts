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
import { CommomFileService } from '../../../../services/file.service';

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
  // @Output() folderClick = new EventEmitter<void>();
  @ViewChild('cm') contextMenu!: ContextMenu;
  value!: string;
  isVertical: boolean = false;
  visiblemoveFile: any;
  // moveDirectory: any;
  contextMenuItems: MenuItem[] = [
    {
      label: 'Скачать',
      icon: 'pi pi-download',
      command: () => this.commomFileService.downloadFile(this.file.id),
    },
    {
      label: 'Переименовать',
      icon: 'pi pi-pencil',
      command: () => this.openDialogRename(this.file.fileName),
    },
    {
      label: 'Переместить',
      icon: 'pi pi-arrow-right',
      command: () => this.moveFile(this.file),
    },
    {
      label: 'Удалить',
      icon: 'pi pi-trash',
      command: () => this.deleteFile(this.file.id),
    },
  ];

  constructor(private myDocumentsService: MyDocumentsService,
    public fileService: FileService,
    private toastService: ToastService,
    private commomFileService: CommomFileService) {

  }

  ngOnInit(): void {
    this.myDocumentsService.isVertical$.subscribe((type: boolean) => {
      this.isVertical = type;
    })
  }

  moveFile(file: any) {
    this.visiblemoveFile = file;
    this.myDocumentsService.setMoveFile(file);
  }

  subscribeToMoveEvents(): void {
    this.myDocumentsService.moveFileObservable.subscribe((file) => {
      this.visiblemoveFile = file;
    });

  }

  onRightClick(event: MouseEvent, file: any) {
    this.file = file;
    event.preventDefault();
    this.fileService.setMenu(this.contextMenu);
    this.contextMenu.show(event);
  }


  // handleClick() {
  //   if (this.file.isFolder) {
  //     this.folderClick.emit();
  //   }
  // }

  deleteFile(id: string) {
    this.myDocumentsService.deleteFile(id).subscribe(
      (data: any) => {
        const idFolder = this.myDocumentsService.getIdFolder();
        this.myDocumentsService.loadData(idFolder);
        this.toastService.showSuccess('Успешно!', 'Операция выполнена успешно');
      },
      (error: any) => {
        this.toastService.showError('Ошибка!', 'Не удалось удалить файл');
      }
    );
  }

  openDialogRename(fileName: string) {
    this.fileService.visibleShonRename = true;
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
        const idFolder = this.myDocumentsService.getIdFolder();
        this.myDocumentsService.loadData(idFolder);
        this.toastService.showSuccess('Успешно!', 'Файл переименован');
      },
      (error: any) => {
        this.toastService.showError('Ошибка!', 'Не удалось переименовать файл');
      }
    );
  }

}