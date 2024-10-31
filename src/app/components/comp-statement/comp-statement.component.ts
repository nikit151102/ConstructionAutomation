import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FileSelectEvent, FileUploadModule, UploadEvent } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { CompStatementService } from './comp-statement.service';
import { SelectedFiles } from '../../interfaces/files';

@Component({
  selector: 'app-comp-statement',
  standalone: true,
  imports: [FileUploadModule, ToastModule],
  templateUrl: './comp-statement.component.html',
  styleUrl: './comp-statement.component.scss',
  providers: [
    MessageService
  ]
})
export class CompStatementComponent implements OnInit {

  File1!: File;
  File2!: File;

  constructor(private messageService: MessageService, private compStatementService: CompStatementService) { }

  ngOnInit(): void {
  }

  onSelect(fileKey: string, event: FileSelectEvent) {
    const files = event.files;
    if (files.length > 1) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'You can only upload one file at a time.' });
      return;
    }
    if (fileKey === 'file1') {
      this.File1 = files[0];
    } else if (fileKey === 'file2') {
      this.File2 = files[0];
    }
  }

  onUpload() {
    if (this.File1 == undefined || this.File2 == undefined) {
      return;
    }
    const selectedFiles: SelectedFiles = {
      File1: this.File1,
      File2: this.File2
    }
    console.log("(this.selectedFiles", selectedFiles)

    // this.compStatementService.uploadFiles(selectedFiles).subscribe({
    //   next: (response) => {
    //     console.log("Файлы отправлены успешно", response)
    //   },
    //   error: (error) => {
    //     console.log("Ошибка отправки файлов", error)
    //   }
    // });
  }

}
