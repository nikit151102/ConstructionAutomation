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
    private myDocumentsService: MyDocumentsService,
    private cdRef: ChangeDetectorRef
  ) {
    this.personalAccountService.changeTitle('Мои документы');
  }
  visibleUpload: boolean = false;
  testFiles: any;
  isVertical: boolean = false;


  ngOnInit(): void {
    this.myDocumentsService.loadData();
    this.myDocumentsService.filesSelect$.subscribe((data: any) => {
      this.testFiles = data;
    })

    this.myDocumentsService.isVertical$.subscribe((type: boolean) => {
      this.isVertical = type;
    })
  }

  onChangeType(isVertical: boolean) {
    this.myDocumentsService.setTypeView(isVertical);
  }


  currentFiles = this.files;
  breadcrumbs: MenuItem[] = [
    { label: 'Хранилище' }
  ];

  openFolder(folder: any) {
    this.breadcrumbs.push({ label: folder.title });
    this.currentFiles = folder.children || [];
  }

  goBack() {
    this.breadcrumbs.pop();
    this.currentFiles = this.getFilesByBreadcrumbs();
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

  downloadFile(fileId: string) {
    this.myDocumentsService.downloadFile(fileId).subscribe((data: Blob) => {
      
      const downloadUrl = window.URL.createObjectURL(data);
      console.log("data", data)
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = downloadUrl;
      // link.download = data.nameFile || 'downloaded-file';
      link.click();

      window.URL.revokeObjectURL(downloadUrl);
    }, error => {
      console.error('Ошибка при скачивании файла:', error);
    });
  }

  uploadedFiles: File[] = [];

  onUpload(event: any): void {
    if (event.files && event.files.length > 0) {
      this.uploadedFiles = event.files;
    } else {
      console.log('No files selected.');
    }
  }

  onSelect(event: any): void {
    this.uploadedFiles = [...this.uploadedFiles, ...event.files];
  }


  Upload(): void {
    if (this.uploadedFiles && this.uploadedFiles.length > 0) {
      this.myDocumentsService.upload(this.uploadedFiles).subscribe({
        next: (response: any) => {
          console.log('Upload successful:')
          this.visibleUpload = false;
          this.myDocumentsService.loadData();
        },
        error: (error) => console.error('Upload failed:', error),
      });
    } else {
      console.warn('No files to upload.');
    }
  }


  removeFile(file: File): void {
    this.uploadedFiles = this.uploadedFiles.filter((f) => f !== file);
    console.log('File removed:', file.name);
    this.cdRef.detectChanges();
    console.log('this.uploadedFiles',this.uploadedFiles)
  }


}


