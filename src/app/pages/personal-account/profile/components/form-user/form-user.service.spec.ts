import { TestBed } from '@angular/core/testing';

import { FormUserService } from './form-user.service';

describe('FormUserService', () => {
  let service: FormUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
