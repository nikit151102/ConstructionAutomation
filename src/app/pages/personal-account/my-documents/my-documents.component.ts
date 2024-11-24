import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-my-documents',
  standalone: true,
  imports: [CommonModule, FileComponent, ButtonModule, FileUploadModule, SelectButtonModule, FormsModule],
  templateUrl: './my-documents.component.html',
  styleUrls: ['./my-documents.component.scss'],
})
export class MyDocumentsComponent implements OnInit {

  files: any = [
    {
      icon: 'pngs/folder.png',
      title: 'folder 1',
      date: '2024-11-15',
      isFolder: true,
      children: [
        { icon: 'pngs/file.png', title: 'file 1-1', date: '2024-11-14', isFolder: false },
        { icon: 'pngs/file.png', title: 'file 1-2', date: '2024-11-13', isFolder: false },
      ],
    },
    {
      icon: 'pngs/folder.png',
      title: 'folder 2',
      date: '2024-11-14',
      isFolder: true,
      children: [{ icon: 'pngs/file.png', title: 'file 2-1', date: '2024-11-13', isFolder: false }],
    },
    {
      icon: 'pngs/file.png',
      title: 'file 3',
      date: '2024-11-13',
      isFolder: false,
    },
  ];

  stateOptions: any[] = [{ label: 'Плитка', value: true },
  { label: 'Список', value: false },];


  constructor(private personalAccountService: PersonalAccountService,
    public myDocumentsService: MyDocumentsService,
    private cdRef: ChangeDetectorRef,
    private toastService: ToastService,
    private progressSpinnerService: ProgressSpinnerService,
    private commomFileService: CommomFileService

  ) {
    this.personalAccountService.changeTitle('Мои документы');
    this.progressSpinnerService.show();
  }
  visibleUpload: boolean = false;
  testFiles: any;
  isVertical: boolean = false;
  errorMessage: string | null = ''

  ngOnInit(): void {
    this.testFiles = null;

    this.myDocumentsService.loadData();
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
      this.myDocumentsService.upload(this.uploadedFiles).subscribe({
        next: (response: any) => {
          this.visibleUpload = false;
          this.myDocumentsService.loadData();
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


}


