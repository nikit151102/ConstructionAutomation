import { TestBed } from '@angular/core/testing';

import { PopUpConfirmEmailService } from './pop-up-confirm-email.service';

describe('PopUpConfirmEmailService', () => {
  let service: PopUpConfirmEmailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopUpConfirmEmailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
