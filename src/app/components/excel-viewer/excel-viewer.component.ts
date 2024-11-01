import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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

export class ExcelViewerComponent {
  workbook!: XLSX.WorkBook;
  excelData: ExcelCell[][] = [];
  sheetNames: string[] = [];
  selectedSheet: string = '';

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array((e.target as FileReader).result as ArrayBuffer);
        this.workbook = XLSX.read(data, { type: 'array' });
        this.sheetNames = this.workbook.SheetNames;
        this.selectedSheet = this.sheetNames[0];
        this.loadSheetData(this.workbook, this.selectedSheet);
      };
      reader.readAsArrayBuffer(file);
    }
  }

  loadSheetData(workbook: XLSX.WorkBook, sheetName: string) {
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false }) as any[][];

    const maxRowLength = jsonData.reduce((max, row) => {
      const lastNonEmptyIndex = row.reduceRight((lastIndex, cell, index) => cell ? index + 1 : lastIndex, 0);
      return Math.max(max, lastNonEmptyIndex);
    }, 0);

    this.excelData = jsonData.map(row =>
      Array.from({ length: maxRowLength }, (_, i) => ({
        value: row[i] ?? null,
        colspan: 1,
        rowspan: 1
      }))
    );

    if (worksheet['!merges']) {
      worksheet['!merges'].forEach(merge => {
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

    this.excelData = this.excelData
      .filter(row => row.some(cell => cell !== null))
      .map(row => {
        return row.slice(0, maxRowLength);
      });
  }

}

