import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DocumentsService } from './documents.service';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToastModule } from 'primeng/toast';
import { FormsComponent } from './forms/forms.component';
import { ActivatedRoute } from '@angular/router';
import { ConfigType, getFormConfig } from './confs';
import { PreviewComponent } from './preview/preview.component';
import { PersonalAccountService } from '../personal-account.service';
import { PreviewPdfComponent } from '../../../components/preview-pdf/preview-pdf.component';
import { HistoryFormingComponent } from '../../../components/history-forming/history-forming.component';
import { HistoryFormingService } from '../../../components/history-forming/history-forming.service';

@Component({
  selector: 'app-document',
  standalone: true,
  imports: [CommonModule, FileUploadModule, ToastModule, ReactiveFormsModule, FormsModule, DropdownModule, CalendarModule, SelectButtonModule, FormsComponent, PreviewComponent, PreviewPdfComponent, HistoryFormingComponent],
  templateUrl: './document.component.html',
  styleUrl: './document.component.scss'
})
export class DocumentComponent implements OnInit {

  config: any;

  constructor(public documentsService: DocumentsService, private route: ActivatedRoute,
    private personalAccountService: PersonalAccountService,
    private cdr: ChangeDetectorRef,
    private historyFormingService: HistoryFormingService) { }

  ngOnInit(): void {
    this.documentsService.visiblePdf = false;
    this.documentsService.selectPdf = null;
    this.route.paramMap.subscribe(params => {
      const configType = params.get('configType') as ConfigType | null;

      if (configType && ['comparativeStatement', 'materialSpecification', 'workSpecification'].includes(configType)) {
        this.config = getFormConfig(configType as ConfigType);
        this.personalAccountService.changeTitle(this.config.nameDoc)
        this.cdr.detectChanges();
      } else {
        console.error('Invalid configType:', configType);
      }
    });

  }

  selectfile: any = null;
  selectedSheet: string = '';
  visiblePdf: boolean = false;



  onUploadSuccess(response: any): void {
    if (response) {
      this.documentsService.setSuccessDoc(response);
      this.historyFormingService.setHistoryDocsValue({
        id: response.data.id,
        statusCode: response.data.statusCode,
        statusDescriprion: response.data.statusDescriprion,
        fileName: response.data.fileName,
        balance: 0,
        fileSize: response.data.fileSize,
        documentType: response.data.documentType,
        initDate:response.data.initDate,
        documentPdfId: response.data.documentPdfId,
        documentXlsxId: response.data.documentXlsxId,
        DocumentPdfShortId: response.data.DocumentPdfShortId,
        createDateTime: response.data.createDateTime,
        changeDateTime: response.data.changeDateTime,
      })
      this.historyFormingService.selectExcel = response.documentMetadata.fullResultXlsx
      this.historyFormingService.selectpdf = response.documentMetadata.fullResultPdf
      if (response.pdfFile) {
        const base64Data = response.pdfFile.fileContents;
        const pdfBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        this.historyFormingService.selectpdf = new Blob([pdfBytes], { type: 'application/pdf' });
        this.documentsService.visiblePdf = false;
      }
    } else {
      this.historyFormingService.selectpdf = null;
      this.historyFormingService.visiblePdf = false;
    }

  }


  isFullscreen = false;

  toggleFullscreen(isFullscreen: boolean) {
    this.isFullscreen = isFullscreen;
    console.log('Fullscreen state:', this.isFullscreen);
  }



}

