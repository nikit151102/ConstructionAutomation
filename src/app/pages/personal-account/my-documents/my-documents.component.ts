import { Component, OnInit } from '@angular/core';
import { PersonalAccountService } from '../personal-account.service';
import { CommonModule } from '@angular/common';
import { FileComponent } from './file/file.component';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MyDocumentsService } from './my-documents.service';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-my-documents',
  standalone: true,
  imports: [CommonModule, FileComponent, ButtonModule, FileUploadModule],
  templateUrl: './my-documents.component.html',
  styleUrls: ['./my-documents.component.scss'],
})
export class MyDocumentsComponent implements OnInit {
  testFiles = [
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

  files: any = [];

  constructor(private personalAccountService: PersonalAccountService,
    private myDocumentsService: MyDocumentsService
  ) {
    this.personalAccountService.changeTitle('Мои документы');
  }

  ngOnInit(): void {
    this.myDocumentsService.getAllUserDocuments().subscribe((data: any) => {
      this.files = data.data.map((file: any) => ({
        ...file,
        icon: 'pngs/file.png'
      }));
    })
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
    console.log("fileId", fileId);
    
    this.myDocumentsService.downloadFile(fileId).subscribe((data: Blob) => {
    
      const downloadUrl = window.URL.createObjectURL(data);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileId;  
      link.click();  
      
      window.URL.revokeObjectURL(downloadUrl);
    }, error => {
      console.error('Ошибка при скачивании файла:', error);
    });
  }
  
  newfile!: any;
  onUpload(event: FileSelectEvent) {
    if (event.files && event.files.length > 0) {
      console.log('Files uploaded:', event.files); 
      this.newfile = Array.from(event.files); 
    } else {
      console.log('No files selected.');
    }
  }
  
  Upload(){
     this.myDocumentsService.upload(this.newfile).subscribe((data:any)=> console.log("upload file"))
  }
}


