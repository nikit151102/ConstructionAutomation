import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-excel-viewer',
  templateUrl: './excel-viewer.component.html',
  styleUrls: ['./excel-viewer.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TableModule,]
})

export class ExcelViewerComponent implements OnChanges {
  @Input() blob?: Blob; 
  @Input() sheetName: string = '';

  workbook!: XLSX.WorkBook;
  excelData: ({ value: any; colspan: number; rowspan: number } | null)[][] = [];
  sheetNames: string[] = [];
  selectedSheet: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['blob'] && this.blob) {
      this.processBlob(this.blob);
    }

    if (changes['sheetName'] && this.workbook) {
      this.selectedSheet = this.sheetName || this.selectedSheet;
      this.loadSheetData(this.workbook, this.selectedSheet);
    }
  }

  private processBlob(blob: Blob) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array((e.target as FileReader).result as ArrayBuffer);
      this.workbook = XLSX.read(data, { type: 'array' });
      this.sheetNames = this.workbook.SheetNames;
      this.selectedSheet = this.sheetName || this.sheetNames[0];
      this.loadSheetData(this.workbook, this.selectedSheet);
    };
    reader.readAsArrayBuffer(blob);
  }

  private loadSheetData(workbook: XLSX.WorkBook, sheetName: string) {
    try {
      const worksheet = workbook.Sheets[sheetName];
      if (!worksheet) {
        return;
      }

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false }) as any[][];
      const maxRowLength = jsonData.reduce((max, row) => Math.max(max, row.length), 0);

      this.excelData = jsonData.map(row =>
        Array.from({ length: maxRowLength }, (_, i) => ({
          value: row[i] ?? null,
          colspan: 1,
          rowspan: 1,
        }))
      );

      if (worksheet['!merges']) {
        worksheet['!merges'].forEach((merge) => {
          const { s: start, e: end } = merge;
          const cell = this.excelData[start.r][start.c];
          if (cell) {
            cell.colspan = end.c - start.c + 1;
            cell.rowspan = end.r - start.r + 1;

            for (let row = start.r; row <= end.r; row++) {
              for (let col = start.c; col <= end.c; col++) {
                if (row !== start.r || col !== start.c) {
                  this.excelData[row][col] = null;
                }
              }
            }
          }
        });
      }

      this.excelData = this.excelData.filter(row => row.some(cell => cell !== null));
    } catch (error) {
      console.error('Error loading sheet data:', error);
    }
  }

  ngOnDestroy(): void {
    this.blob = undefined;
    this.sheetName = '';
    this.excelData = [];
    this.selectedSheet = '';
  }
}