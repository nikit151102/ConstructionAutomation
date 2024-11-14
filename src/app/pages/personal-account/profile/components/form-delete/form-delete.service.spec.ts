import { TestBed } from '@angular/core/testing';

import { FormDeleteService } from './form-delete.service';

describe('FormDeleteService', () => {
  let service: FormDeleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormDeleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
