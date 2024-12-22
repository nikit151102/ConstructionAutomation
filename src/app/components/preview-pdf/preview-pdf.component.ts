import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChildren, QueryList } from '@angular/core';
import { GlobalWorkerOptions, getDocument, PDFDocumentProxy } from 'pdfjs-dist';

@Component({
  selector: 'app-preview-pdf',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview-pdf.component.html',
  styleUrls: ['./preview-pdf.component.scss']
})
export class PreviewPdfComponent implements OnInit {
  @ViewChildren('pdfCanvas') pdfCanvases!: QueryList<ElementRef<HTMLCanvasElement>>;
  @Input() pdfData!: Blob;
  pdf: PDFDocumentProxy | null = null;
  pages: number[] = []; 
  currentScale: number = 1.5; 
  isRendering: boolean = false;

  constructor() {
    GlobalWorkerOptions.workerSrc = 'pdfjs/pdf.worker.preview.mjs';
  }

  ngOnInit(): void {
    this.loadPdf();
  }

  loadPdf(): void {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const pdfData = new Uint8Array(e.target!.result as ArrayBuffer);
      getDocument(pdfData).promise.then((pdf: PDFDocumentProxy) => {
        this.pdf = pdf;
        this.pages = Array.from({ length: pdf.numPages }, (_, i) => i + 1); 
        this.renderAllPages();
      });
    };
    fileReader.readAsArrayBuffer(this.pdfData);
  }

  renderAllPages(): void {
    if (this.pdf) {
      this.pages.forEach((pageNum, index) => {
        this.pdf?.getPage(pageNum).then((page) => {
          const canvas = this.pdfCanvases.toArray()[index];
          if (canvas && canvas.nativeElement) {
            const context = canvas.nativeElement.getContext('2d');
            if (context) { 
              const viewport = page.getViewport({ scale: this.currentScale }); 
              canvas.nativeElement.height = viewport.height;
              canvas.nativeElement.width = viewport.width;

              const renderContext = {
                canvasContext: context,
                viewport: viewport
              };

              page.render(renderContext).promise.catch((error: any) => {
                console.error(`Error rendering page ${pageNum}:`, error);
              });
            }
          }
        });
      });
    }
  }

  zoomIn(): void {
    this.currentScale += 0.2;
    this.renderAllPages(); 
  }

  zoomOut(): void {
    if (this.currentScale > 0.5) { 
      this.currentScale -= 0.2; 
      this.renderAllPages(); 
    }
  }
}
