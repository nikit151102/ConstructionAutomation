import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import * as shapefile from 'shapefile';
import proj4 from 'proj4';
import { FeatureCollection } from 'geojson';
proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs'); 
proj4.defs('EPSG:3857', '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs'); 
import { YandexMapService } from '../../../yandex-map.service';
import { DialogModule } from 'primeng/dialog';
import { MapService } from './map.service';
import { ProgressSpinnerService } from '../../../components/progress-spinner/progress-spinner.service';
import { ButtonModule } from 'primeng/button';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DialogModule, ButtonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
  private map: any;
  private ymaps: any;
  private drawingPolygon: any;
  private isDrawing = false;
  private currentContour: number[][] = [];

  uploadForm!: FormGroup;
  display: boolean = false;

  strokeColor = '#0000FF';
  fillColor = '#00FF0077';
  strokeWidth = 2;

  public polygons: any[] = [];

  selectedPolygon: any = null;

  constructor(private yandexMapService: YandexMapService,
    private mapService: MapService,
    private cdr: ChangeDetectorRef,
    public spinnerService: ProgressSpinnerService,
    private fb: FormBuilder, private progressSpinnerService: ProgressSpinnerService) {
    this.uploadForm = this.fb.group({
      shapeFile: [null, Validators.required],
      dbfFile: [null, Validators.required],
      batchSize: [null, [Validators.required, Validators.min(1)]],
      titleSize: [null, [Validators.required, Validators.min(1)]],
    });
  }

  async ngOnInit(): Promise<void> {
    await this.yandexMapService.loadYandexMaps();
    this.ymaps = this.yandexMapService.getYmaps();

    this.ymaps.ready(() => {
      this.map = new this.ymaps.Map('map', {
        center: [55.76, 37.64], 
        zoom: 10,
      });
    });
  }

  startDrawing(): void {
    if (this.isDrawing) return;

    this.isDrawing = true;
    this.currentContour = []; 

    this.drawingPolygon = new this.ymaps.GeoObject(
      {
        geometry: {
          type: 'Polygon',
          coordinates: [this.currentContour],
        },
      },
      {
        fillColor: '#0044bb4d',
        strokeColor: '#00FF0077',
        strokeWidth: 2,
      }
    );

    this.map.geoObjects.add(this.drawingPolygon);

    this.map.events.add('click', this.onMapClick.bind(this));

    this.map.events.add('dblclick', this.finishDrawing.bind(this));
  }

  onMapClick(event: any): void {
    const coords = event.get('coords');
    const lastPoint = this.currentContour[this.currentContour.length - 1];
    if (!lastPoint || (lastPoint[0] !== coords[0] || lastPoint[1] !== coords[1])) {
      this.currentContour.push(coords);
    }

    this.drawingPolygon.geometry.setCoordinates([this.currentContour]);
  }



  finishDrawing(): void {
    if (!this.isDrawing) return;

    this.isDrawing = false;
    this.map.events.remove('click', this.onMapClick.bind(this));
    this.map.events.remove('dblclick', this.finishDrawing.bind(this));

    if (this.currentContour.length > 2) {
      const firstPoint = this.currentContour[0];
      const lastPoint = this.currentContour[this.currentContour.length - 1];
      if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
        this.currentContour.push(firstPoint);
      }
    }

    this.drawingPolygon.geometry.setCoordinates([this.currentContour]);

    const coordinates = this.currentContour;

    const area = this.calculatePolygonAreaInMeters(coordinates);  
    const perimeter = this.calculatePolygonPerimeter(coordinates); 

    const polygonId = `polygon-${this.polygons.length + 1}`;
    this.polygons.push({
      id: polygonId,
      coordinates: [...coordinates],
      strokeColor: this.strokeColor,
      fillColor: this.fillColor,
      strokeWidth: this.strokeWidth,
      area: area.toFixed(2), 
      perimeter: perimeter.toFixed(2),
      geoObject: this.drawingPolygon,
      visible: true,
    });

    this.currentContour = [];
    alert('Полигон успешно создан!');
    this.cdr.detectChanges();
  }



  calculatePolygonAreaInMeters(coordinates: number[][]): number {
    const R = 6378137; 
    let area = 0;

    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

    for (let i = 0; i < coordinates.length; i++) {
      const [x1, y1] = coordinates[i];
      const [x2, y2] = coordinates[(i + 1) % coordinates.length]; 

      const lat1 = toRadians(y1);
      const lon1 = toRadians(x1);
      const lat2 = toRadians(y2);
      const lon2 = toRadians(x2);

      area += (lon2 - lon1) * (2 + Math.sin(lat1) + Math.sin(lat2));
    }

    area = (area * R * R) / 2; 
    return Math.abs(area);
  }


  calculatePolygonPerimeter(coordinates: number[][]): number {
    let perimeter = 0;
    for (let i = 0; i < coordinates.length - 1; i++) {
      perimeter += this.ymaps.coordSystem.geo.getDistance(coordinates[i], coordinates[i + 1]);
    }
    perimeter += this.ymaps.coordSystem.geo.getDistance(
      coordinates[coordinates.length - 1],
      coordinates[0]
    );
    return perimeter;
  }


  editPolygon(polygon: any): void {
    this.selectedPolygon = polygon;

    this.strokeColor = polygon.strokeColor;
    this.fillColor = polygon.fillColor;
    this.strokeWidth = polygon.strokeWidth;

    this.cdr.detectChanges();
  }

  saveEditedPolygon(): void {
    if (!this.selectedPolygon) return;

    const index = this.polygons.findIndex(p => p.id === this.selectedPolygon.id);
    if (index !== -1) {

      this.polygons[index] = {
        ...this.polygons[index],
        strokeColor: this.strokeColor,
        fillColor: this.fillColor,
        strokeWidth: this.strokeWidth,

      };

      const updatedPolygon = this.polygons[index];
      const geoObject = updatedPolygon.geoObject;

      geoObject.options.set('strokeColor', updatedPolygon.strokeColor);
      geoObject.options.set('fillColor', updatedPolygon.fillColor);
      geoObject.options.set('strokeWidth', updatedPolygon.strokeWidth);
    }

    this.selectedPolygon = null; 
  }

  deletePolygon(polygon: any): void {
    const index = this.polygons.findIndex(p => p.id === polygon.id);
    if (index !== -1) {
      this.map.geoObjects.remove(this.polygons[index].geoObject);

      this.polygons.splice(index, 1);
    }

    if (this.selectedPolygon && this.selectedPolygon.id === polygon.id) {
      this.selectedPolygon = null; 
    }

    this.cdr.detectChanges();
  }


  togglePolygonVisibility(polygon: any): void {
    polygon.visible = !polygon.visible;
    
    if (polygon.visible) {
      this.map.geoObjects.add(polygon.geoObject);
    } else {
      this.map.geoObjects.remove(polygon.geoObject);
    }
  
    this.cdr.detectChanges();
  }

  

  fileArray: any[] = [];

  onSubmit() {
    if (this.uploadForm.valid) {
      const formData = new FormData();
      this.spinnerService.show();
      formData.append('shapeFile', this.uploadForm.get('shapeFile')?.value);
      formData.append('dbfFile', this.uploadForm.get('dbfFile')?.value);
      formData.append('batchSize', this.uploadForm.get('batchSize')?.value);
      formData.append('titleSize', this.uploadForm.get('titleSize')?.value);

      //  this.mapService.getMLWork(formData).subscribe(
      //    (response) => {
      //      console.log('Ответ от сервера:', response);
      //     this.display = false; 


      //    },
      //    (error) => {
      //      console.error('Ошибка:', error);
      //    }
      //  );
      const idShpFile = '971b869f-aef4-435d-835e-eceff96a4d16'
      const idDbfFile = 'eb64e95a-e1c3-4db0-a45f-b59c4445fa90'
      this.display = false;
      this.loadShapefiles(idDbfFile, idShpFile);
    } else {
      this.uploadForm.markAllAsTouched();
    }
  }

  private loadShapefiles(idDbfFile: string, idShpFile: string): void {
    forkJoin({
      dbfFile: this.mapService.download(idDbfFile),
      shpFile: this.mapService.download(idShpFile)
    }).subscribe({
      next: ({ dbfFile, shpFile }) => {
        this.processFileData(dbfFile.file, this.fileArray);
        this.processFileData(shpFile.file, this.fileArray);

        this.onShapefileUpload(this.fileArray);
      },
      error: (err) => {
        console.error('Ошибка при загрузке файлов SHP и DBF:', err);
      }
    });
  }


  processFileData(fileObject: any, fileArray: any[]): void {
    try {
      if (!fileObject.fileContents || !fileObject.fileDownloadName) {
        console.error('Некорректный объект файла:', fileObject);
        return;
      }

      const decodedData = this.decodeBase64(fileObject.fileContents);

      const fileBlob = new Blob([decodedData], { type: fileObject.contentType || 'application/octet-stream' });

      fileArray.push({
        name: fileObject.fileDownloadName,
        blob: fileBlob,
        size: decodedData.length,
      });

      console.log(`Файл "${fileObject.fileDownloadName}" обработан и добавлен в массив.`);
    } catch (error) {
      console.error('Ошибка обработки файла:', error);
    }
  }

  private decodeBase64(base64: string): Uint8Array {
    const binaryString = atob(base64); 
    const length = binaryString.length;
    const bytes = new Uint8Array(length);

    for (let i = 0; i < length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes;
  }


  async onShapefileUpload(files: { name: string; blob: Blob; size: number }[]): Promise<void> {
    if (!files || files.length === 0) return;

    const shpFile = files.find(file => file.name.endsWith('.shp'));
    const dbfFile = files.find(file => file.name.endsWith('.dbf'));

    if (!shpFile || !dbfFile) {
      alert('Необходимо загрузить оба файла: .shp и .dbf');
      return;
    }

    try {
      let shpBuffer: ArrayBuffer;
      let dbfBuffer: ArrayBuffer;

      shpBuffer = await shpFile.blob.arrayBuffer();
      dbfBuffer = await dbfFile.blob.arrayBuffer();

      const source = await shapefile.open(shpBuffer, dbfBuffer);
      const features: FeatureCollection = {
        type: 'FeatureCollection',
        features: [],
      };

      let result;
      while (!(result = await source.read()).done) {
        features.features.push(result.value);
      }

      this.addShapefileToMap(features);

    } catch (error) {
      console.error('Ошибка обработки Shapefile:', error);
      alert('Не удалось загрузить Shapefile. Проверьте файлы.');
    }
  }



  addShapefileToMap(featureCollection: FeatureCollection): void {
    const addedPolygons: number[][][] = []; 

    featureCollection.features.forEach((feature) => {
      const geometry = feature.geometry;

      if (geometry?.type === 'Polygon' && Array.isArray(geometry.coordinates)) {
        const coordinates = geometry.coordinates;

        if (
          Array.isArray(coordinates[0]) &&
          coordinates[0].every((coord) => Array.isArray(coord) && coord.length === 2)
        ) {
          const transformedCoordinates = coordinates.map((ring) =>
            ring.map(([x, y]) => [y, x])
          );

          const area = this.PolygonAreaInMeters(transformedCoordinates[0]); 
          const perimeter = this.PolygonPerimeter(transformedCoordinates[0]);

          const polygon = new this.ymaps.Polygon(
            transformedCoordinates,
            {
              hintContent: `Площадь: ${area.toFixed(2)} м², Периметр: ${perimeter.toFixed(2)} м`,
            },
            {
              fillColor: this.fillColor,
              strokeColor: this.strokeColor,
              strokeWidth: this.strokeWidth,
            }
          );

          this.map.geoObjects.add(polygon);

          this.polygons.push({
            id: `polygon-${this.polygons.length + 1}`,
            coordinates: transformedCoordinates,
            geoObject: polygon,
            strokeColor: this.strokeColor,
            fillColor: this.fillColor,
            strokeWidth: this.strokeWidth,
            visible: true,
            area: area.toFixed(2), 
            perimeter: perimeter.toFixed(2),
          });

          addedPolygons.push(transformedCoordinates[0]);
        } else {
          console.warn('Некорректные координаты в полигоне:', coordinates);
        }
      }
    });

    if (addedPolygons.length > 0) {
 
      const bounds: [number, number][] = addedPolygons.flat().reduce(
        (acc, [lat, lon]) => {
          return [
            [Math.min(acc[0][0], lat), Math.min(acc[0][1], lon)], 
            [Math.max(acc[1][0], lat), Math.max(acc[1][1], lon)], 
          ];
        },
        [
          [Infinity, Infinity], 
          [-Infinity, -Infinity], 
        ]
      );

      this.map.setBounds(bounds, {
        checkZoomRange: true, 
        zoomMargin: 50, 
      });
    }

    this.spinnerService.hide();
    this.display = false;
    
    this.cdr.detectChanges();
  }

  PolygonAreaInMeters(coordinates: number[][]): number {
    const R = 6378137; 
    let area = 0;

    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

    for (let i = 0; i < coordinates.length; i++) {
      const [x1, y1] = coordinates[i];
      const [x2, y2] = coordinates[(i + 1) % coordinates.length]; 

      const lat1 = toRadians(y1);
      const lon1 = toRadians(x1);
      const lat2 = toRadians(y2);
      const lon2 = toRadians(x2);

      area += (lon2 - lon1) * (2 + Math.sin(lat1) + Math.sin(lat2));
    }

    area = (area * R * R) / 2; 
    return Math.abs(area); 
  }

  PolygonPerimeter(coordinates: number[][]): number {
    let perimeter = 0;

    for (let i = 0; i < coordinates.length - 1; i++) {
      perimeter += this.ymaps.coordSystem.geo.getDistance(coordinates[i], coordinates[i + 1]);
    }

    perimeter += this.ymaps.coordSystem.geo.getDistance(
      coordinates[coordinates.length - 1],
      coordinates[0]
    );

    return perimeter;
  }

}