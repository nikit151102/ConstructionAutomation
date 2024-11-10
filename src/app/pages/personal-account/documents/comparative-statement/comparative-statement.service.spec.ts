import { TestBed } from '@angular/core/testing';

import { ComparativeStatementService } from './comparative-statement.service';

describe('ComparativeStatementService', () => {
  let service: ComparativeStatementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComparativeStatementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
