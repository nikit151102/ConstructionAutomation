import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ExcelViewerComponent } from '../../../../../components/excel-viewer/excel-viewer.component';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [CommonModule, SelectButtonModule, FormsModule, ExcelViewerComponent],
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

  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
    this.fullscreenToggle.emit(this.isFullscreen);
  }

  onViewChange(fileKey: string) {
    this.viewChange.emit(fileKey);
  }
}
