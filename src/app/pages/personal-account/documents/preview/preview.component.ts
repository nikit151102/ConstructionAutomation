import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ExcelViewerComponent } from '../../../../components/excel-viewer/excel-viewer.component';
import { MyDocumentsService } from '../../my-documents/my-documents.service';
import { ToastService } from '../../../../services/toast.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [CommonModule, SelectButtonModule, FormsModule, ExcelViewerComponent, ButtonModule],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.scss'
})
export class PreviewComponent {
  @Input() selectedFile: File | null = null;
  @Input() selectedSheet: string = '';
  @Input() stateOptions: any[] = [];
  @Output() viewChange = new EventEmitter<string>();
  @Output() fullscreenToggle = new EventEmitter<boolean>();

  isFullscreen: boolean = false;

  constructor(private myDocumentsService: MyDocumentsService,
    private toastService: ToastService
  ){}

  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
    this.fullscreenToggle.emit(this.isFullscreen);
  }

  onViewChange(fileKey: string) {
    this.viewChange.emit(fileKey);
  }


  downloadFile() {
    // this.myDocumentsService.downloadFile(fileId).subscribe((data: Blob) => {
    //   // const fileName = .fileName || 'downloaded-file';
    //   const downloadUrl = window.URL.createObjectURL(data);
    //   const link = document.createElement('a');
    //   link.href = downloadUrl;
    //   link.download = fileName;
    //   link.click();

    //   window.URL.revokeObjectURL(downloadUrl);
    // }, error => {
    //   console.error('Ошибка при скачивании файла:', error);
    //   this.toastService.showError('Ошибка!', 'Не удалось скачать файл');
    // });
  }

}
