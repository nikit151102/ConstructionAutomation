import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MyDocumentsService } from '../my-documents.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-file',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './file.component.html',
  styleUrl: './file.component.scss'
})
export class FileComponent {

  @Input() file!: any;
  @Input() isdelete: boolean = false;
  @Output() folderClick = new EventEmitter<void>();
  value!: string;
  constructor(private myDocumentsService: MyDocumentsService) {

  }

  handleClick() {
    if (this.file.isFolder) {
      this.folderClick.emit();
    }
  }

  deleteFile(id: string) {
    this.myDocumentsService.deleteFile(id).subscribe((data: any) => console.log("deletFile"));
  }

  renameFile(filleId: string) {
    let data = {
      Id: filleId,
      Name: this.value
    }
    this.myDocumentsService.renameFile(filleId, data).subscribe((data: any) => console.log("renameFile"));
  }

  downloadFile(fileId: string) {
    this.myDocumentsService.downloadFile(fileId).subscribe((data: Blob) => {

      const downloadUrl = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = downloadUrl;
      link.click();

      window.URL.revokeObjectURL(downloadUrl);
    }, error => {
      console.error('Ошибка при скачивании файла:', error);
    });
  }


}