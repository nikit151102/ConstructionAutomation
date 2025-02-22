import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DocumentsService } from './documents.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToastModule } from 'primeng/toast';
import { FormsComponent } from './forms/forms.component';
import { ActivatedRoute } from '@angular/router';
import { ConfigType, getFormConfig } from './confs';
import { PersonalAccountService } from '../personal-account.service';
import { PreviewPdfComponent } from '../../../components/preview-pdf/preview-pdf.component';
import { HistoryFormingComponent } from '../../../components/history-forming/history-forming.component';
import { HistoryFormingService } from '../../../components/history-forming/history-forming.service';
import { PopUpComponent } from '../../../components/pop-up/pop-up.component';

@Component({
  selector: 'app-document',
  standalone: true,
  imports: [CommonModule, FileUploadModule, ToastModule, ReactiveFormsModule, FormsModule, DropdownModule, CalendarModule, SelectButtonModule, FormsComponent, PreviewPdfComponent, PreviewPdfComponent, HistoryFormingComponent, PopUpComponent],
  templateUrl: './document.component.html',
  styleUrl: './document.component.scss'
})
export class DocumentComponent implements OnInit {

  config: any;

  constructor(public documentsService: DocumentsService, private route: ActivatedRoute,
    private personalAccountService: PersonalAccountService,
    public cdr: ChangeDetectorRef,
    private historyFormingService: HistoryFormingService) { }

  ngOnInit(): void {
    this.documentsService.visiblePdf = false;
    this.documentsService.selectPdf = null;
    this.route.paramMap.subscribe(params => {
      const configType = params.get('configType') as ConfigType | null;

      if (configType && ['comparativeStatement', 'materialSpecification', 'workSpecification', 'actHideWorksRequest', 'journalGeneral'].includes(configType)) {
        this.config = getFormConfig(configType as ConfigType);
        this.personalAccountService.changeTitle(this.config.nameDoc)
        this.cdr.detectChanges();
      }
    });

  }

  selectfile: any = null;
  selectedSheet: string = '';
  visiblePdf: boolean = false;


  onUploadSuccess(response: any): void {
    if (!response || !response.data) {
      this.historyFormingService.selectpdf = null;
      this.historyFormingService.visiblePdf = false;
      return;
    }

    const { data, documentMetadata, pdfFile, storageInfo } = response;

    this.documentsService.setSuccessDoc(response);
    this.historyFormingService.setHistoryDocsValue({
      id: data.id,
      statusCode: data.statusCode,
      statusDescription: data.statusDescription,
      fileName: data.fileName,
      balance: 0,
      fileSize: data.fileSize,
      documentType: data.documentType,
      initDate: data.initDate,
      documentPdfId: data.documentPdfId,
      documentXlsxId: data.documentXlsxId,
      documentPdfShortId: data.DocumentPdfShortId,
      createDateTime: data.initDateTime,
      changeDateTime: data.changeDateTime,
      cost: data.cost
    });

    this.historyFormingService.selectExcel = documentMetadata.fullResultXlsx;
    this.historyFormingService.selectpdf = documentMetadata.fullResultPdf;

    if (pdfFile) {
      this.setPdfFile(pdfFile.fileContents);
    }
  }

  private setPdfFile(base64Data: string): void {
    const pdfBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    this.historyFormingService.selectpdf = new Blob([pdfBytes], { type: 'application/pdf' });
    this.documentsService.visiblePdf = false;
  }

  isFullscreen = false;

  toggleFullscreen(isFullscreen: boolean) {
    this.isFullscreen = isFullscreen;
  }



}

