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
  blob: any;

  @Input() stateOptions: any[] = [];
  @Output() viewChange = new EventEmitter<string>();
  @Output() fullscreenToggle = new EventEmitter<boolean>();

  isFullscreen: boolean = false;

  constructor(private myDocumentsService: MyDocumentsService,
    private toastService: ToastService,
    private documentsService: DocumentsService
  ) { }

  ngOnInit(): void {
    this.blob = null;
  if (this.blobUrl) {
    window.URL.revokeObjectURL(this.blobUrl); 
    this.blobUrl = null;
  }
    this.documentsService.isSuccessDoc$.subscribe((data: any) => {
      this.blob = data;
      
    })
  }

  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
    this.fullscreenToggle.emit(this.isFullscreen);
  }

  onViewChange(fileKey: string) {
    this.viewChange.emit(fileKey);
  }


  downloadFile() {
    if (this.blob) {
      const downloadUrl = window.URL.createObjectURL(this.blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'fileName';
      link.click();

      window.URL.revokeObjectURL(downloadUrl);
    } else {
      this.toastService.showError('Ошибка!', 'Нет файла для скачивания');
    }
  }


}
