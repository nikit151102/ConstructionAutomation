import { TestBed } from '@angular/core/testing';

import { YandexMapService } from './yandex-map.service';

describe('YandexMapService', () => {
  let service: YandexMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YandexMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
