import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { PersonalAccountService } from '../personal-account.service';
import { CommonModule } from '@angular/common';
import { FileComponent } from './file/file.component';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MyDocumentsService } from './my-documents.service';
import { FileUploadModule } from 'primeng/fileupload';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../services/toast.service';
import { ProgressSpinnerService } from '../../../components/progress-spinner/progress-spinner.service';
import { CommomFileService } from '../../../services/file.service';
import { FolderComponent } from './folder/folder.component';
import { CurrentUserService } from '../../../services/current-user.service';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';
import { CreateFolderComponent } from './create-folder/create-folder.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DragDropModule } from 'primeng/dragdrop';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';

@Component({
  selector: 'app-my-documents',
  standalone: true,
  imports: [CommonModule, FileComponent, ButtonModule, FileUploadModule, SelectButtonModule, FormsModule, FolderComponent, MenuModule, ToastModule, CreateFolderComponent, BreadcrumbModule, DragDropModule, ContextMenuModule],
  templateUrl: './my-documents.component.html',
  styleUrls: ['./my-documents.component.scss'],
})
export class MyDocumentsComponent implements OnInit {

  files: any = [];

  home = {
    icon: 'pi pi-home',
    command: () => {
      this.myDocumentsService.BreadcrumbItems = [];
      this.myDocumentsService.loadData('');
    }
  };

  items: MenuItem[] | undefined = [
    {
      label: 'Создать папку',
      icon: 'pi pi-folder-plus',
      command: () => {
        this.visibleUpload = false;
        this.myDocumentsService.visibleCreateFolder = true;
      }
    },
    {
      label: 'Загрузить файл',
      icon: 'pi pi-cloud-upload',
      command: () => {
        this.visibleUpload = true;
        this.myDocumentsService.visibleCreateFolder = false;
      }
    }
  ];

  contextMenuItems: MenuItem[] = [
    {
      label: 'Создать папку',
      icon: 'pi pi-folder-plus',
      command: () => {
        this.visibleUpload = false;
        this.myDocumentsService.visibleCreateFolder = true;
      }
    },
    {
      label: 'Загрузить файл',
      icon: 'pi pi-cloud-upload',
      command: () => {
        this.visibleUpload = true;
        this.myDocumentsService.visibleCreateFolder = false;
      }
    }
  ];

  stateOptions: any[] = [{ label: ' ', value: true, icon: 'pi pi-th-large' },
  { label: ' ', value: false, icon: 'pi pi-bars' },];


  constructor(private personalAccountService: PersonalAccountService,
    public myDocumentsService: MyDocumentsService,
    private cdRef: ChangeDetectorRef,
    private toastService: ToastService,
    private progressSpinnerService: ProgressSpinnerService,
    private commomFileService: CommomFileService,
    private currentUserService: CurrentUserService,
    private cdr: ChangeDetectorRef
  ) {
    this.personalAccountService.changeTitle('Мои документы');
    this.progressSpinnerService.show();
  }
  visibleUpload: boolean = false;
  testFiles: any;
  isVertical: boolean = false;
  errorMessage: string | null = ''

  ngOnInit(): void {
    this.myDocumentsService.BreadcrumbItems = [];
    this.updateContextMenu();
    this.subscribeToMoveEvents();
    this.testFiles = null;
    this.progressSpinnerService.show();
    const userId = this.currentUserService.getUser();
    this.myDocumentsService.loadData('');

    this.totalSize = this.myDocumentsService.storageInfo.storageVolumeUsage;
    this.myDocumentsService.filesSelect$.subscribe({
      next: (data: any) => {
        this.testFiles = data;

        this.progressSpinnerService.hide();
      },
      error: (error) => {
        this.toastService.showError('Ошибка', 'Не удалось загрузить данные');
        this.progressSpinnerService.hide();
      },
    });
    this.myDocumentsService.isVertical$.subscribe((type: boolean) => {
      this.isVertical = type;
    })
  }

  moveFile: any;
  moveDirectory: any;

  subscribeToMoveEvents(): void {
    this.myDocumentsService.moveFileObservable.subscribe((file) => {
      this.moveFile = file;
      console.log('wdw', file)
      this.updateContextMenu();
    });

    this.myDocumentsService.moveDirectoryObservable.subscribe((directory) => {
      this.moveDirectory = directory;
      this.updateContextMenu();
    });
  }

  updateContextMenu(): void {
    if (this.moveFile || this.moveDirectory) {
      const pasteItemExists = this.contextMenuItems.some(item => item.label === 'Вставить');
      if (!pasteItemExists) {
        this.contextMenuItems = [
          ...this.contextMenuItems,
          {
            label: 'Вставить',
            icon: 'pi pi-clipboard',
            command: () => this.pasteItem(),
          }
        ];
      }
    } else {
      this.contextMenuItems = this.contextMenuItems.filter(item => item.label !== 'Вставить');
    }
    this.cdr.detectChanges();
  }


  pasteItem(): void {
    const idFolder = this.myDocumentsService.BreadcrumbItems.length > 0
      ? this.myDocumentsService.BreadcrumbItems[this.myDocumentsService.BreadcrumbItems.length - 1]['idFolder'] ?? ""
      : "";
    if (this.moveDirectory) {
      const folder = this.moveDirectory;
      this.myDocumentsService.handleFolderMove(folder.id, idFolder, idFolder)
      this.moveDirectory = null;
    }
    else if (this.moveFile) {
      const file = this.moveFile;
      this.myDocumentsService.handleFileMove(file.id, idFolder, idFolder)
      this.moveFile = null;

    }
  }


  onChangeType(isVertical: boolean) {
    this.myDocumentsService.setTypeView(isVertical);
  }

  getSizeInMB(size: number) {
    return this.commomFileService.fileSizeInMB(size);
  }

  currentFiles = this.files;
  breadcrumbs: MenuItem[] = [
    { label: 'Хранилище' }
  ];

  openFolder(folder: any) {
    this.breadcrumbs.push({ label: folder.title });
    this.currentFiles = folder.children || [];
    this.toastService.showSuccess('Папка открыта', `Вы перешли в папку ${folder.title}`);
  }

  goBack() {
    this.breadcrumbs.pop();
    this.currentFiles = this.getFilesByBreadcrumbs();
    this.toastService.showSuccess('Назад', 'Вы вернулись к предыдущей папке');
  }

  goToBreadcrumb(index: number) {
    if (index < this.breadcrumbs.length - 1) {
      this.breadcrumbs = this.breadcrumbs.slice(0, index + 1);
      this.currentFiles = this.getFilesByBreadcrumbs();
    }
  }

  getFilesByBreadcrumbs() {
    let files = this.files;
    for (const breadcrumb of this.breadcrumbs) {
      const folder = files.find((file: any) => file.title === breadcrumb.label && file.isFolder);
      if (folder) {
        files = folder.children || [];
      }
    }
    return files;
  }

  uploadedFiles: File[] = [];
  disabledUploadBtn: boolean = false;


  onUpload(event: any): void {
    if (event.files && event.files.length > 0) {
      this.uploadedFiles = event.files;
    } else {
      console.log('No files selected.');
    }
  }

  totalSize: number = 0;

  onSelect(event: any): void {
    const selectedFiles = event.files;

    for (let file of selectedFiles) {
      const fileSizeInBits = file.size * 8;
      this.totalSize += fileSizeInBits;

      if (this.totalSize > this.myDocumentsService.storageInfo.storageVolumeCopacity) {
        this.errorMessage = `Файлы превышают доступную память. Лимит: ${this.commomFileService.fileSizeInMB(this.myDocumentsService.storageInfo.storageVolumeCopacity)} MB`;
        console.log('return')
        this.disabledUploadBtn = true;
      }
    }
    if (!this.disabledUploadBtn) {
      this.disabledUploadBtn = false;

      this.errorMessage = null;
      this.uploadedFiles = [...this.uploadedFiles, ...selectedFiles];
    }

  }


  clearAllFiles(): void {
    this.uploadedFiles = [];
    const fileUpload: any = document.querySelector('p-fileUpload');
    if (fileUpload && fileUpload.clear) {
      fileUpload.clear();
    }
    this.visibleUpload = false;
    this.errorMessage = null;
    this.disabledUploadBtn = false;
    this.totalSize = this.myDocumentsService.storageInfo.storageVolumeUsage;
  }

  Upload(): void {
    if (this.uploadedFiles && this.uploadedFiles.length > 0) {
      const idFolder = this.myDocumentsService.BreadcrumbItems.length > 0
        ? this.myDocumentsService.BreadcrumbItems[this.myDocumentsService.BreadcrumbItems.length - 1]['idFolder'] ?? ""
        : "";

      this.myDocumentsService.upload({ DirectoryId: idFolder, files: this.uploadedFiles }).subscribe({
        next: (response: any) => {
          this.visibleUpload = false;
          this.myDocumentsService.loadData(idFolder);
          this.toastService.showSuccess('Загрузка завершена', 'Файлы успешно загружены');
        },
        error: (error) => {
          console.error('Upload failed:', error);
          this.toastService.showError('Ошибка', 'Не удалось загрузить файлы');
        },
      });
    } else {
      this.toastService.showWarn('Предупреждение', 'Нет файлов для загрузки');
    }
  }


  removeFile(file: File): void {
    this.uploadedFiles = this.uploadedFiles.filter((f) => f !== file);
    this.cdRef.detectChanges();
  }


  draggedItem: any = null;

  onDragStart(event: DragEvent, item: any): void {
    this.draggedItem = item;
    event.dataTransfer?.setData('text/plain', JSON.stringify(item));
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent, targetFolder: any): void {
    event.preventDefault();

    if (!this.draggedItem) return;

    if (this.draggedItem.id === targetFolder.id) {
      console.warn('Нельзя переместить папку в саму себя!');
      return;
    }

    const idFolder = this.getCurrentFolderId();

    if (this.draggedItem.type === 'file') {
      this.myDocumentsService.handleFileMove(this.draggedItem.id, idFolder, targetFolder.id);
    } else if (this.draggedItem.type === 'directory') {
      this.myDocumentsService.handleFolderMove(this.draggedItem.id, idFolder, targetFolder.id);
    }

    this.draggedItem = null;
  }

  private getCurrentFolderId(): string {
    return this.myDocumentsService.BreadcrumbItems.length > 0
      ? this.myDocumentsService.BreadcrumbItems[this.myDocumentsService.BreadcrumbItems.length - 1]['idFolder'] ?? ""
      : "";
  }






}


