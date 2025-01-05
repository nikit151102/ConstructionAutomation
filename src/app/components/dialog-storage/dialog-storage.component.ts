import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FileComponent } from '../../pages/personal-account/my-documents/file/file.component';
import { FolderComponent } from '../../pages/personal-account/my-documents/folder/folder.component';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { DialogStorageService } from './dialog-storage.service';
import { MyDocumentsService } from '../../pages/personal-account/my-documents/my-documents.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dialog-storage',
  standalone: true,
  imports: [CommonModule,
    DialogModule,
    ButtonModule,
    SelectButtonModule,
    FileComponent,
    FolderComponent,
    BreadcrumbComponent,
    FormsModule],
  templateUrl: './dialog-storage.component.html',
  styleUrl: './dialog-storage.component.scss'
})
export class DialogStorageComponent {

  @Output() confirm = new EventEmitter();
  visible: boolean = false;
  isVertical: boolean = false;
  visibleDialog: boolean = false;
  Files: any;
  selectFile: any;
  stateOptions = [
    { label: 'Плитка', value: true },
    { label: 'Список', value: false },
  ];

  constructor(public dialogStorageService: DialogStorageService, private myDocumentsService: MyDocumentsService) { }

  ngOnInit(): void {
    this.subscribeToDialogVisibility();
    this.subscribeToFileListVisibility();
    this.subscribeToViewType();
    this.fetchUserDocuments();
  }

  private subscribeToViewType(): void {
    this.dialogStorageService.isVertical$.subscribe((isVertical) => {
      this.isVertical = isVertical;
    });
  }

  private subscribeToFileListVisibility(): void {
    this.dialogStorageService.isListFilesVisible$.subscribe((visible) => {
      this.visible = visible;
    });
  }

  private subscribeToDialogVisibility(): void {
    this.dialogStorageService.isVisibleDialog$.subscribe((visible) => {
      this.visibleDialog = visible;
    });
  }

  private fetchUserDocuments(): void {
    this.myDocumentsService.loadData('');

    this.myDocumentsService.filesSelect$.subscribe((value: any) => {
      this.Files = value;
    });
  }

  onChangeType(isVertical: boolean): void {
    this.dialogStorageService.setTypeView(isVertical);
  }

  confirmSelection() {
    this.confirm.emit({confirm: this.selectFile, type:'selectFile'});
  }

  DirectorySelection(){
    const lastBreadcrumbItem = this.myDocumentsService.BreadcrumbItems[this.myDocumentsService.BreadcrumbItems.length - 1];
    this.confirm.emit({confirm: lastBreadcrumbItem.idFolder, type:'selectDirectory'});
  }

  setSelectFile(event:any){
    this.selectFile = event;
  }

}
