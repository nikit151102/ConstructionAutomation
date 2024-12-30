import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { PDFDocumentProxy, getDocument, GlobalWorkerOptions, PDFPageProxy } from 'pdfjs-dist';
import jsPDF from 'jspdf';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class PdfViewerComponent implements OnInit {
  @ViewChild('pdfCanvas', { static: true }) pdfCanvas!: ElementRef<HTMLCanvasElement>;
  pdf: PDFDocumentProxy | null = null;
  currentPage: number = 1;
  totalPages: number = 0;
  stampImage: string | ArrayBuffer | null = null;
  stampPosition = { x: 0, y: 0 };
  finalStampPosition: any
  stampSize = { width: 50, height: 50 };
  isDragging = false;
  isResizing = false;
  isRendering: boolean = false;

  constructor() {
    GlobalWorkerOptions.workerSrc = 'pdfjs/pdf.worker.mjs';
  }

  ngOnInit(): void { }

  onFileChange(event: any) {
    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const typedarray = new Uint8Array(fileReader.result as ArrayBuffer);
      getDocument(typedarray).promise.then(pdf => {
        this.pdf = pdf;
        this.totalPages = pdf.numPages;
        this.renderPage(this.currentPage);
      });
    };
    fileReader.readAsArrayBuffer(file);
  }

  renderPage(pageNum: number) {
    if (this.isRendering) return;
    this.isRendering = true;
    if (this.pdf)
      this.pdf.getPage(pageNum).then((page: any) => {
        const context = this.pdfCanvas.nativeElement.getContext('2d');
        const viewport = page.getViewport({ scale: 1.5 });
        this.pdfCanvas.nativeElement.height = viewport.height;
        this.pdfCanvas.nativeElement.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };

        const renderTask = page.render(renderContext);
        renderTask.promise.then(() => {
          this.isRendering = false;
        }).catch((error: any) => {
          this.isRendering = false;
        });
      });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.renderPage(this.currentPage);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.renderPage(this.currentPage);
    }
  }

  onImageChange(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      this.stampImage = e.target?.result ?? null;

      const img = new Image();
      img.src = this.stampImage as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (ctx) {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0, img.width, img.height);
          this.removeBackground(ctx, canvas.width, canvas.height);
          this.stampImage = canvas.toDataURL('image/png');
        }
      };
    };
    reader.readAsDataURL(file);
  }

  removeBackground(ctx: CanvasRenderingContext2D, width: number, height: number) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      if (r > 200 && g > 200 && b > 200) {
        data[i + 3] = 0;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }

  startDrag(event: MouseEvent) {
    this.isDragging = true;
    const offsetX = event.clientX - this.stampPosition.x;
    const offsetY = event.clientY - this.stampPosition.y;

    const mouseMoveHandler = (e: MouseEvent) => {
      if (this.isDragging) {
        this.stampPosition.x = e.clientX - offsetX;
        this.stampPosition.y = e.clientY - offsetY;

        const canvasRect = this.pdfCanvas.nativeElement.getBoundingClientRect();
        this.stampPosition.x = Math.max(0, Math.min(this.stampPosition.x, canvasRect.width - this.stampSize.width));
        this.stampPosition.y = Math.max(0, Math.min(this.stampPosition.y, canvasRect.height - this.stampSize.height));

        this.renderPage(this.currentPage);
      }
    };

    const mouseUpHandler = () => {
      this.isDragging = false;
      window.removeEventListener('mousemove', mouseMoveHandler);
      window.removeEventListener('mouseup', mouseUpHandler);

      this.finalStampPosition = { x: this.stampPosition.x, y: this.stampPosition.y };
    };

    window.addEventListener('mousemove', mouseMoveHandler);
    window.addEventListener('mouseup', mouseUpHandler);
  }

  startResize(event: MouseEvent) {
    this.isResizing = true;

    const mouseMoveHandler = (e: MouseEvent) => {
      if (this.isResizing) {
        const newWidth = e.clientX - this.stampPosition.x;
        const newHeight = e.clientY - this.stampPosition.y;

        this.stampSize.width = Math.max(20, newWidth);
        this.stampSize.height = Math.max(20, newHeight);

        this.renderPage(this.currentPage);
      }
    };

    const mouseUpHandler = () => {
      this.isResizing = false;
      window.removeEventListener('mousemove', mouseMoveHandler);
      window.removeEventListener('mouseup', mouseUpHandler);
    };

    window.addEventListener('mousemove', mouseMoveHandler);
    window.addEventListener('mouseup', mouseUpHandler);
  }

  saveDocument() {
    if (!this.pdf) {
      console.error("No PDF document loaded.");
      return;
    }

    const pdf = new jsPDF();
    const scale = 1.5;

    // Рендер текущей страницы PDF на холсте
    this.pdf.getPage(this.currentPage).then((page: PDFPageProxy) => {
      const viewport = page.getViewport({ scale });
      const context = this.pdfCanvas.nativeElement.getContext('2d');

      if (!context) {
        return;
      }

      // Настройка размеров холста по масштабу
      this.pdfCanvas.nativeElement.width = viewport.width;
      this.pdfCanvas.nativeElement.height = viewport.height;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      // Рендер страницы на холсте
      page.render(renderContext).promise.then(() => {
        if (this.stampImage) {
          const img = new Image();
          img.src = this.stampImage as string;

          img.onload = () => {
            // Корректировка координат и размеров штампа
            const adjustedX = this.finalStampPosition.x * scale;
            const adjustedY = this.finalStampPosition.y * scale;
            const adjustedWidth = this.stampSize.width * scale;
            const adjustedHeight = this.stampSize.height * scale;

            // Отобразить штамп на холсте
            context.drawImage(img, adjustedX, adjustedY, adjustedWidth, adjustedHeight);

            // Конвертировать холст в изображение и добавить в PDF
            const canvasData = this.pdfCanvas.nativeElement.toDataURL('image/jpeg', 1.0);
            pdf.addPage([viewport.width, viewport.height]);
            pdf.addImage(canvasData, 'JPEG', 0, 0, viewport.width, viewport.height);

            pdf.save('document_with_stamp.pdf');
          };
        } else {
          console.error("Stamp image is null or not loaded.");
        }
      }).catch((error: any) => {
        console.error("Error rendering page to canvas:", error);
      });
    }).catch((error) => {
      console.error("Error loading PDF page:", error);
    });
  }



}
