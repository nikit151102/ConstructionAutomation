import { TestBed } from '@angular/core/testing';

import { ExcelViewerService } from './excel-viewer.service';

describe('ExcelViewerService', () => {
  let service: ExcelViewerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExcelViewerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
