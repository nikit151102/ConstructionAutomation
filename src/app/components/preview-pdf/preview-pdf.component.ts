import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';
import { GlobalWorkerOptions, PDFDocumentProxy, getDocument } from 'pdfjs-dist';

@Component({
  selector: 'app-preview-pdf',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview-pdf.component.html',
  styleUrl: './preview-pdf.component.scss'
})
export class PreviewPdfComponent implements OnInit {
  @ViewChild('pdfCanvas', { static: true }) pdfCanvas!: ElementRef<HTMLCanvasElement>;
  @Input() pdfData!: Blob;  
  pdf: PDFDocumentProxy | null = null;
  currentPage: number = 1;
  totalPages: number = 0;
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
        this.totalPages = pdf.numPages;
        this.renderPage(this.currentPage);
      });
    };
    fileReader.readAsArrayBuffer(this.pdfData);
  }

  renderPage(pageNum: number) {
    if (this.isRendering) return;
    this.isRendering = true;
    if (this.pdf) {
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
}
