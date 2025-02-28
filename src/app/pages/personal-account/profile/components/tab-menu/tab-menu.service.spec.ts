import { TestBed } from '@angular/core/testing';

import { TabMenuService } from './tab-menu.service';

describe('TabMenuService', () => {
  let service: TabMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TabMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
