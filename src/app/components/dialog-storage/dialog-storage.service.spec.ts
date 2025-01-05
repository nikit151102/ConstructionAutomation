import { TestBed } from '@angular/core/testing';

import { DialogStorageService } from './dialog-storage.service';

describe('DialogStorageService', () => {
  let service: DialogStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DialogStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
