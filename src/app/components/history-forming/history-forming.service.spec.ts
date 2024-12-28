import { TestBed } from '@angular/core/testing';

import { HistoryFormingService } from './history-forming.service';

describe('HistoryFormingService', () => {
  let service: HistoryFormingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoryFormingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
