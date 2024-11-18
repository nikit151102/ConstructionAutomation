import { TestBed } from '@angular/core/testing';

import { MyDocumentsService } from './my-documents.service';

describe('MyDocumentsService', () => {
  let service: MyDocumentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyDocumentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
