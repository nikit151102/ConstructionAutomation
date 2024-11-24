import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ExcelViewerComponent } from '../../../../components/excel-viewer/excel-viewer.component';
import { ButtonModule } from 'primeng/button';
import { DocumentsService } from '../documents.service';
import { CommomFileService } from '../../../../services/file.service';

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
  blob: any;
  @Input() stateOptions: any[] = [];
  @Output() viewChange = new EventEmitter<string>();
  @Output() fullscreenToggle = new EventEmitter<boolean>();

  isFullscreen: boolean = false;

  constructor(
    private documentsService: DocumentsService,
    private commomFileService: CommomFileService
  ) { }

  ngOnInit(): void {

    this.documentsService.isSuccessDoc$.subscribe((data: any) => {
      if (data) {
        this.fileMetadata = data.documentMetadata;  
        this.blob = this.commomFileService.createBlob(data.file);
        this.blobUrl = this.commomFileService.createBlobUrl(this.blob)
      }
    });
  }

  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
    this.fullscreenToggle.emit(this.isFullscreen);
  }

  onViewChange(fileKey: string) {
    this.viewChange.emit(fileKey);
  }

  downloadFile() {
    this.commomFileService.downloadFile(this.fileMetadata.id);
  }
}
