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
    try {
      const worksheet = workbook.Sheets[sheetName];
      if (!worksheet) {
        console.error(`Worksheet ${sheetName} not found in workbook.`);
        return;
      }

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false }) as any[][];
      console.log("jsonData",jsonData)
      // Определяем начальную строку
      let startRow = 0;
      while (startRow < jsonData.length && jsonData[startRow].every(cell => cell === null || cell === undefined)) {
        startRow++;
      }
      
      // Если не нашли ни одной строки с данными
      if (startRow >= jsonData.length) {
        console.error(`No data found in worksheet ${sheetName}.`);
        return;
      }
      let maxRowLength
      
      // Обрезаем данные, начиная с найденной строки
      const filteredData = jsonData.slice(startRow);
      console.log("filteredData",filteredData)
      maxRowLength = filteredData.reduce((max, row) => {
        const lastNonEmptyIndex = row.reduceRight((lastIndex, cell, index) => cell ? index + 1 : lastIndex, 0);
        return Math.max(max, lastNonEmptyIndex);
      }, 0);

      if(maxRowLength==1){
        maxRowLength = filteredData.reduce((max, row) => {
          const nonEmptyCount = row.filter(cell => cell !== null && cell !== undefined).length;
          return Math.max(max, nonEmptyCount);
        }, 0);
      }else{
        maxRowLength = maxRowLength +1
      }

      console.log("maxRowLength",maxRowLength)
      this.excelData = filteredData.map(row =>
        Array.from({ length: maxRowLength }, (_, i) => ({
          value: row[i] ?? null,
          colspan: 1,
          rowspan: 1
        }))
      );
  
      // Обработка объединённых ячеек
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
  
      // Убираем пустые строки и обрезаем колонки
      this.excelData = this.excelData
        .filter(row => row.some(cell => cell !== null))
        .map(row => {
          return row.slice(0, maxRowLength);
        });
  
    } catch (error) {
      console.error('Error loading sheet data:', error);
    }
  }
  

}

