import { TestBed } from '@angular/core/testing';

import { UnsubscribeMailingService } from './unsubscribe-mailing.service';

describe('UnsubscribeMailingService', () => {
  let service: UnsubscribeMailingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnsubscribeMailingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
