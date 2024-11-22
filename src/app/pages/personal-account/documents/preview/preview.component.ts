import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ExcelViewerComponent } from '../../../../components/excel-viewer/excel-viewer.component';
import { MyDocumentsService } from '../../my-documents/my-documents.service';
import { ToastService } from '../../../../services/toast.service';
import { ButtonModule } from 'primeng/button';
import { DocumentsService } from '../documents.service';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [CommonModule, SelectButtonModule, FormsModule, ExcelViewerComponent, ButtonModule],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.scss'
})
export class PreviewComponent implements OnInit {
  @Input() selectedSheet: string = '';
  blobUrl: string | null = null;
  fileMetadata: any;  
  blob:any;
  @Input() stateOptions: any[] = [];
  @Output() viewChange = new EventEmitter<string>();
  @Output() fullscreenToggle = new EventEmitter<boolean>();

  isFullscreen: boolean = false;

  constructor(
    private myDocumentsService: MyDocumentsService,
    private toastService: ToastService,
    private documentsService: DocumentsService
  ) {}

  ngOnInit(): void {
  
    this.documentsService.isSuccessDoc$.subscribe((data: any) => {
      if (data) {
        this.fileMetadata = data.documentMetadata;  // Получаем метаданные файлаP
        
        this.createBlobUrl(data.file);  // Создаем URL для файла
      }
    });
  }

  // Создание URL для скачивания файла
  private createBlobUrl(fileData: any): void {
    const blob = this.createBlobFromData(fileData); // Преобразуем данные в Blob
   this.blob = blob;
   console.log('this.blob', this.blob)
    this.blobUrl = window.URL.createObjectURL(blob); // Генерируем URL
  }

  private createBlobFromData(fileData: any): Blob {
    if (!fileData.fileContents) {
      console.error('Отсутствуют данные файла для преобразования в Blob.');
      return new Blob(); // Возвращаем пустой Blob, если данных нет.
    }
  
    const byteCharacters = atob(fileData.fileContents); // Декодируем base64
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      byteArrays.push(new Uint8Array(byteNumbers));
    }
  
    return new Blob(byteArrays, { type: fileData.contentType });
  }
  

  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
    this.fullscreenToggle.emit(this.isFullscreen);
  }

  onViewChange(fileKey: string) {
    this.viewChange.emit(fileKey);
  }

  downloadFile() {
    if (this.fileMetadata) {

      const fileName = this.fileMetadata.fileName || 'downloaded-file';
      const downloadUrl = window.URL.createObjectURL(this.blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      link.click();

      window.URL.revokeObjectURL(downloadUrl);

    } else {
      this.toastService.showError('Ошибка!', 'Нет файла для скачивания');
    }
  }
}
