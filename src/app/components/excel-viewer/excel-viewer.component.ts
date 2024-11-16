import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { ExcelCell } from '../../services/excelFile';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-excel-viewer',
  templateUrl: './excel-viewer.component.html',
  styleUrls: ['./excel-viewer.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TableModule,]
})

export class ExcelViewerComponent implements OnChanges {
  @Input() file?: File; 
  @Input() sheetName: string = ''; 
  workbook!: XLSX.WorkBook;
  excelData: ({ value: any; colspan: number; rowspan: number } | null)[][] = [];
  sheetNames: string[] = [];
  selectedSheet: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['file'] && this.file) {
      this.processFile(this.file);
    }

    if (changes['sheetName'] && this.workbook) {
      this.selectedSheet = this.sheetName || this.selectedSheet;
      this.loadSheetData(this.workbook, this.selectedSheet);
    }
  }

  private processFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array((e.target as FileReader).result as ArrayBuffer);
      this.workbook = XLSX.read(data, { type: 'array' });
      this.sheetNames = this.workbook.SheetNames;

      this.selectedSheet = this.sheetName || this.sheetNames[0];
      this.loadSheetData(this.workbook, this.selectedSheet);
    };
    reader.readAsArrayBuffer(file);
  }

  loadSheetData(workbook: XLSX.WorkBook, sheetName: string) {
    try {
      const worksheet = workbook.Sheets[sheetName];
      if (!worksheet) {
        console.error(`Worksheet ${sheetName} not found in workbook.`);
        return;
      }
  
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false }) as any[][];
      let startRow = 0;
  
      // Skip empty rows
      while (startRow < jsonData.length && jsonData[startRow].every(cell => cell === null || cell === undefined)) {
        startRow++;
      }
  
      if (startRow >= jsonData.length) {
        console.error(`No data found in worksheet ${sheetName}.`);
        return;
      }
  
      const maxRowLength = jsonData.reduce((max, row) => Math.max(max, row.length), 0);
  
      this.excelData = jsonData.slice(startRow).map(row =>
        Array.from({ length: maxRowLength }, (_, i) => ({
          value: row[i] ?? null,
          colspan: 1,
          rowspan: 1
        }))
      );
  
      if (worksheet['!merges']) {
        worksheet['!merges'].forEach(merge => {
          const { s: start, e: end } = merge;

          if (
            start.r < this.excelData.length &&
            start.c < this.excelData[start.r].length
          ) {
            const cell = this.excelData[start.r][start.c];
            if (cell) {
              cell.colspan = end.c - start.c + 1;
              cell.rowspan = end.r - start.r + 1;
  
              for (let row = start.r; row <= end.r; row++) {
                for (let col = start.c; col <= end.c; col++) {
                  if (
                    row !== start.r || col !== start.c
                  ) {
                    if (this.excelData[row] && this.excelData[row][col]) {
                      this.excelData[row][col] = null; 
                    }
                  }
                }
              }
            }
          } else {
            console.warn(
              `Merge range [${start.r},${start.c}] to [${end.r},${end.c}] exceeds data boundaries.`
            );
          }
        });
      }

      this.excelData = this.excelData.filter(row => row.some(cell => cell !== null));
    } catch (error) {
      console.error('Error loading sheet data:', error);
    }
  }
  
}