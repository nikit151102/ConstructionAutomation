import { TestBed } from '@angular/core/testing';

import { InstructionsService } from './instructions.service';

describe('InstructionsService', () => {
  let service: InstructionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstructionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
