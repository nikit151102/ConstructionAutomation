import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FilesListService } from '../files-list.service';
import { ContextMenu } from 'primeng/contextmenu';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { MyDocumentsService } from '../../../../my-documents/my-documents.service';

@Component({
  selector: 'app-select-file',
  standalone: true,
  imports: [CommonModule, TooltipModule],
  templateUrl: './select-file.component.html',
  styleUrl: './select-file.component.scss'
})
export class SelectFileComponent implements OnInit {
  @Input() file!: any;
  @Output() selectFile = new EventEmitter<any>();

  isVertical: boolean = false;
  isSelected: boolean = false;

  constructor(private filesListService: FilesListService, private myDocumentsService:MyDocumentsService) { }

  ngOnInit(): void {
    console.log('file',this.file)
    this.filesListService.isVertical$.subscribe((type: boolean) => {
      this.isVertical = type;
    });
  }

  toggleSelection(): void {
    this.isSelected = !this.isSelected;
    if(this.isSelected){
      this.selectFile.emit(this.file );
    }
  }
  


}