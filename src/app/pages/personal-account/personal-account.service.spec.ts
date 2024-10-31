import { TestBed } from '@angular/core/testing';

import { PersonalAccountService } from './personal-account.service';

describe('PersonalAccountService', () => {
  let service: PersonalAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonalAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
