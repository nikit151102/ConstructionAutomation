import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, Input, OnInit, SimpleChanges } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { HistoryFormingService } from './history-forming.service';
import { CurrentUserService } from '../../services/current-user.service';
import { PopUpComponent } from '../pop-up/pop-up.component';
import { CommomFileService } from '../../services/file.service';
import { PersonalAccountService } from '../../pages/personal-account/personal-account.service';
import { AccordionModule } from 'primeng/accordion';
import { SkeletonModule } from 'primeng/skeleton';
import { PreviewPdfComponent } from '../preview-pdf/preview-pdf.component';
import { DocumentQueueItem, TransactionResponse } from '../../interfaces/docs';
import { Response } from '../../interfaces/common';
import { TypeDoc } from '../../interfaces/docs'

interface Button {
  label: string;
  onClick: () => void;
}

@Component({
  selector: 'app-history-forming',
  standalone: true,
  imports: [CommonModule, ButtonModule, TagModule, ToastModule, ButtonModule, MenuModule, PopUpComponent, AccordionModule, SkeletonModule, PreviewPdfComponent],
  templateUrl: './history-forming.component.html',
  styleUrl: './history-forming.component.scss'
})

export class HistoryFormingComponent implements OnInit {
  historyDocs: DocumentQueueItem[] = [];
  filteredDocs: DocumentQueueItem[] = [];
  items: MenuItem[] | undefined;
  visiblePopUpPay: boolean = false;
  expandedDoc: DocumentQueueItem | null = null;
  pdfBlob!: Blob;
  typeDocs: TypeDoc[] = [
    { name: 'Cопоставительная ведомость', code: '1' },
    { name: 'Спецификация на метериалы', code: '2' },
    { name: 'Спецификация работ', code: '3' },
  ];
  fields = [
    { key: 'statusCode', label: 'Статус' },
    { key: 'FileName', label: 'Название файла' },
    { key: 'FileSize', label: 'Размер' },
    { key: 'InitDate', label: 'Дата' },
    { key: 'DocumentId', label: '' }
  ];
  @Input() selectTypeDoc: string = ''
  selectedTypeDocs: TypeDoc[] = [];
  dropdownOpen: boolean = false;
  currentSortField: string = '';
  isAscending: boolean = true;
  buttons: Button[] = [];

  currentPage: number = 0;
  pageSize: number = 10;
  isLoading: boolean = false;
  totalPages: number | null = null;

  get selectedDocsLabel(): string {
    return this.selectedTypeDocs.length > 0
      ? `Выбрано ${this.selectedTypeDocs.length}`
      : 'Фильтр';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectTypeDoc']) {
      this.selectedTypeDocs = [];
      const selectedDoc = this.typeDocs.find(doc => doc.name === this.selectTypeDoc);
      if (selectedDoc) {
        this.selectedTypeDocs.push(selectedDoc); 
        this.filterDocsByType();
      } 
    }
  }
  
  constructor(
    public historyFormingService: HistoryFormingService,
    private currentUserService: CurrentUserService,
    private commomFileService: CommomFileService,
    private cdr: ChangeDetectorRef,
    private personalAccountService: PersonalAccountService
  ) { }

  ngOnInit() {
    this.historyFormingService.historyDocsState$.subscribe((value: DocumentQueueItem[]) => {
      this.historyDocs = value;
      this.filterDocsByType();
      this.cdr.detectChanges();
    });

    this.loadData(this.currentPage);
    this.filteredDocs = [...this.historyDocs];
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const clickedInside = (event.target as HTMLElement).closest('.multiselect-container');
    if (!clickedInside) {
      this.dropdownOpen = false;
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  isSelected(option: TypeDoc): boolean {
    return this.selectedTypeDocs.some(doc => doc.code === option.code);
  }

  toggleSelection(option: TypeDoc) {
    if (this.isSelected(option)) {
      this.selectedTypeDocs = this.selectedTypeDocs.filter(doc => doc.code !== option.code);
    } else {
      this.selectedTypeDocs.push(option);
    }
    this.filterDocsByType();
  }

  filterDocsByType(): void {
    const selectedCodes = this.selectedTypeDocs.map((type: TypeDoc) => parseInt(type.code, 10));
    this.filteredDocs = this.selectedTypeDocs.length
      ? this.historyDocs.filter(doc => selectedCodes.includes(doc.documentType))
      : [...this.historyDocs];
  }

  toggleAccordion(doc: DocumentQueueItem): void {
    this.expandedDoc = this.expandedDoc === doc ? null : doc;
  }

  loadData(page: number) {
    if (this.isLoading || (this.totalPages && page > this.totalPages)) return;

    this.isLoading = true;

    this.historyFormingService.getHistoryForming(page, this.pageSize).subscribe(
      (response: any) => {
        this.historyFormingService.loadHistoryDocs(response.data);

        if (response.totalPages) {
          this.totalPages = response.totalPages;
        }

        this.isLoading = false;
      },
      (error) => {
        console.error('Ошибка при загрузке данных:', error);
        this.isLoading = false;
      }
    );
  }

  @HostListener('window:scroll', [])
  onScroll() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && !this.isLoading) {
      this.currentPage++;
      this.loadData(this.currentPage);
    }
  }


  generateActions(dataDoc: DocumentQueueItem, statusCode: number): MenuItem[] {

    const commonActions: MenuItem[] = [
      {
        label: 'Предпросмотр',
        icon: 'pi pi-eye',
        class: 'status-preview',
        command: () => this.handlePreview(dataDoc.documentPdfShortId),
      }
    ];

    const statusActionsMap: { [key: number]: MenuItem[] } = {
      1: [
        {
          label: 'Оплатить',
          icon: 'pi pi-credit-card',
          class: 'status-info',
          command: () => this.showPaymentPopup(dataDoc),
        }
      ],
      2: [
        {
          label: 'Excel',
          icon: 'pi pi-file-excel',
          class: 'status-excel',
          command: () => this.downloadFile('excel', dataDoc.documentXlsxId),
        },
        {
          label: 'PDF',
          icon: 'pi pi-file-pdf',
          class: 'status-pdf',
          command: () => this.downloadFile('pdf', dataDoc.documentPdfId),
        }
      ]
    };

    const actions = statusActionsMap[statusCode] ? [...statusActionsMap[statusCode]] : [];

    return [ ...commonActions, ...actions];
  }



  showPaymentPopup(dataDoc: DocumentQueueItem) {
    this.visiblePopUpPay = true;
    this.buttons = [
      { label: 'ОК', onClick: () => this.onOk(dataDoc.id) },
      { label: 'Отмена', onClick: this.onCancel.bind(this) },
    ];
  }

  getSizeInMB(size: number): string {
    return this.commomFileService.fileSizeInMB(size);
  }

  handlePreview(fileId: string): void {
    this.commomFileService.previewfile(fileId).subscribe(
      (blob: Blob) => {
        if (blob) {
          this.pdfBlob = blob;
          this.historyFormingService.updateSelectExcelId('');
          this.historyFormingService.updateSelectPdfId('');
          this.historyFormingService.visiblePdf = true;
        }
      },
      (error: any) => {
        console.error('Ошибка при получении файла для предварительного просмотра:', error);
      }
    );
  }

  downloadFile(type: string, fileId: string) {
    if (type === 'excel' || type === 'pdf') {
      this.commomFileService.downloadFile(fileId);
    }
  }

  sortDocs(field: string) {
    this.isAscending = this.currentSortField === field ? !this.isAscending : true;
    this.currentSortField = field;

    this.historyDocs.sort((a, b) => {
      const valueA = a[field as keyof DocumentQueueItem];
      const valueB = b[field as keyof DocumentQueueItem];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        if (field === 'InitDate') {
          return this.isAscending
            ? new Date(valueA).getTime() - new Date(valueB).getTime()
            : new Date(valueB).getTime() - new Date(valueA).getTime();
        }
        return this.isAscending ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        return this.isAscending ? valueA - valueB : valueB - valueA;
      }

      return 0;
    });
  }

  onOk(id: string): void {
    this.visiblePopUpPay = false;
    this.historyFormingService.makeTransaction(id).subscribe((response: Response<TransactionResponse>) => {
      this.visiblePopUpPay = false;
      this.personalAccountService.changeBalance(String(response.data.balance));
      this.currentUserService.updateUserBalance(String(response.data.balance));
      // this.loadData();
    });
  }

  onCancel(): void {
    this.visiblePopUpPay = false;
  }

  onPopupClose(): void {
    this.visiblePopUpPay = false;
  }

  closePopup(): void {
    this.historyFormingService.visiblePdf = false;
  }

  // getFormattedDivergenceList(): string {
  //   return this.fileMetadata?.divergenceList.replace(/\n/g, '<br>') || '';
  // }


  // getFormattedErrorListCipher(): string {
  //   return this.fileMetadata?.errorListCipher.replace(/\n/g, '<br>') || '';
  // }

}

