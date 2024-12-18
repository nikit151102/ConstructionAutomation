declare module 'shp-write' {
    export function download(geojson: any, options?: any): void;
    export function zip(geojson: any, options?: any): ArrayBuffer;
  }
  