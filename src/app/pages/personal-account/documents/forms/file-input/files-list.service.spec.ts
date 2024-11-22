import { TestBed } from '@angular/core/testing';

import { FilesListService } from './files-list.service';

describe('FilesListService', () => {
  let service: FilesListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilesListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
