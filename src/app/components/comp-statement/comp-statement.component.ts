import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FileUploadModule, UploadEvent } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { CompStatementService } from './comp-statement.service';

@Component({
  selector: 'app-comp-statement',
  standalone: true,
  imports: [FileUploadModule, ToastModule],
  templateUrl: './comp-statement.component.html',
  styleUrl: './comp-statement.component.scss',
  providers:[
    MessageService 
  ]
})
export class CompStatementComponent {

  constructor(private messageService: MessageService, private compStatementService: CompStatementService) { }

  selectedFiles: File[] = [];

  onSelect(event: { files: File[] }) {
    this.selectedFiles = [...this.selectedFiles, ...event.files];
}


  onUpload() {
    if (this.selectedFiles.length !== 2) {
      return;
    }
    console.log("(this.selectedFiles", this.selectedFiles)

    // this.compStatementService.uploadFiles(this.selectedFiles).subscribe({
    //   next: (response) => {
    //     this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Files uploaded successfully' });
    //   },
    //   error: (error) => {
    //     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to upload files' });
    //   }
    // });
  }

}
