import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { ToastService } from '../../services/toast.service';

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
    { name: 'Ведомость объёмов материалов', code: '2' },
    { name: 'Ведомость объемов работ', code: '3' },
    { name: 'Акты освидетельствования скрытых работ', code: '4' },
    { name: 'Журналы работ', code: '5' },
    { name: 'Акт гидравлических испытаний', code: '6' },
    { name: 'Акт проверки стяжки', code: '7' },
    { name: 'Акт пролива кровли', code: '8' },
    { name: 'Акт прочистки магистралей', code: '9' },
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
  pageSize: number = 20;
  isLoading: boolean = false;
  totalPages: number | null = null;

  get selectedDocsLabel(): string {
    return this.selectedTypeDocs.length > 0
      ? `Выбрано ${this.selectedTypeDocs.length}`
      : 'Фильтр';
  }


  @ViewChild('docsContainer') docsContainer!: ElementRef;

  ngAfterViewInit() {
    if (this.docsContainer) {
      this.docsContainer.nativeElement.addEventListener('scroll', this.onScroll.bind(this));
    } else {
      console.error('docsContainer not found!');
    }
  }


  onScroll() {
    const element = this.docsContainer.nativeElement;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - 10 && !this.isLoading) {
      this.currentPage++;
      this.loadData(this.currentPage);
    }
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
    private personalAccountService: PersonalAccountService,
    private toastService: ToastService
  ) { }

  private subscriptions: Subscription = new Subscription();

  trackById(index: number, item: DocumentQueueItem): string {
    return item.id;
  }

  ngOnInit() {
    this.historyFormingService.historyDocsState$.subscribe((value: DocumentQueueItem[]) => {
      this.historyDocs = value;
      this.filterDocsByType();
      this.filteredDocs = [...this.filteredDocs];
      this.cdr.markForCheck();
    });


    this.subscriptions.add(
      this.historyFormingService.messages$.subscribe((data) => {
        this.historyFormingService.setNewHistoryDocsValue(data);
        this.cdr.markForCheck();
      })
    );

    this.loadData(0);
    this.filteredDocs = [...this.historyDocs];
    this.historyFormingService.connectToWebSocket();

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
    this.cdr.markForCheck();
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
    this.cdr.markForCheck();
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
    if (page === 0) this.historyFormingService.clearHistoryDocs();
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
        const errorMessage = error?.error?.Message || 'Произошла неизвестная ошибка';
        this.toastService.showError('Ошибка', errorMessage);
      }
    );
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
      0: [
        {
          label: 'Отмена',
          icon: 'pi pi-ban',
          class: 'status-cancel',
          command: () => this.showCancel(dataDoc, 'CancelDocumentGenerate'),
        }
      ],
      1: [
        {
          label: 'Оплатить',
          icon: 'pi pi-credit-card',
          class: 'status-success',
          command: () => this.showPaymentPopup(dataDoc),
        },
        {
          label: 'Удалить',
          icon: 'pi pi-trash',
          class: 'status-danger',
          command: () => this.showCancel(dataDoc, 'DeleteDocumentGenerate'),
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
        },
        {
          label: 'Удалить',
          icon: 'pi pi-trash',
          class: 'status-danger',
          command: () => this.showCancel(dataDoc, 'DeleteDocumentGenerate'),
        }
      ],
      3: [
        {
          label: 'Удалить',
          icon: 'pi pi-trash',
          class: 'status-danger',
          command: () => this.showCancel(dataDoc, 'DeleteDocumentGenerate'),
        },
      ],
    };

    const actions = statusActionsMap[statusCode] ? [...statusActionsMap[statusCode]] : [];

    return [...commonActions, ...actions];
  }


  currentPrice: any;

  showPaymentPopup(dataDoc: DocumentQueueItem) {
    this.currentPrice = dataDoc.cost;
    this.visiblePopUpPay = true;
    this.buttons = [
      {
        label: 'ОК', onClick: () => {
          this.currentPrice = null;
          this.onOk(dataDoc.id)
        }
      },
      { label: 'Отмена', onClick: this.onCancel.bind(this) },
    ];
  }

  showCancel(data: any, endpoint: string) {
    this.historyFormingService.makeCancelDelete(data.id, endpoint).subscribe((response: Response<TransactionResponse>) => {
      this.visiblePopUpPay = false;
      let historyDocs = this.historyFormingService.getHistoryDocsValue();
      historyDocs = historyDocs.filter((doc: any) => doc.id !== data.id);
      this.historyFormingService.clearHistoryDocs();
      this.historyFormingService.loadHistoryDocs(historyDocs);
      this.cdr.markForCheck();
    });
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
      (error) => {
        const errorMessage = error?.error?.Message || 'Произошла неизвестная ошибка';
        this.toastService.showError('Ошибка', errorMessage);
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
    this.historyFormingService.makeTransaction(id).subscribe((response: Response<any>) => {
      this.visiblePopUpPay = false;
      this.personalAccountService.changeBalance(String(response.data.balance));
      this.personalAccountService.changeFreeGenerating(String(response.data.freeGenerating));
      this.currentUserService.updateUserBalance(String(response.data.balance));
      this.cdr.markForCheck();
    });
  }

  onCancel(): void {
    this.currentPrice = null;
    this.visiblePopUpPay = false;
  }

  onPopupClose(): void {
    this.currentPrice = null;
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


  ngOnDestroy(): void {
    this.historyFormingService.disconnectWebSocket();
    this.subscriptions.unsubscribe();
  }

}
