import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-file',
  standalone: true,
  imports: [],
  templateUrl: './file.component.html',
  styleUrl: './file.component.scss'
})
export class FileComponent {

  @Input() file!: { icon: string; title: string; date: string; isFolder: boolean; children?: any[] };
  @Output() folderClick = new EventEmitter<void>();

  handleClick() {
    if (this.file.isFolder) {
      this.folderClick.emit();
    }
  }

}