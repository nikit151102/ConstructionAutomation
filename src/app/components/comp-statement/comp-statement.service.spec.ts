import { TestBed } from '@angular/core/testing';

import { CompStatementService } from './comp-statement.service';

describe('CompStatementService', () => {
  let service: CompStatementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompStatementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
