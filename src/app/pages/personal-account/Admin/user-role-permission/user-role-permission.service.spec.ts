import { TestBed } from '@angular/core/testing';

import { UserRolePermissionService } from './user-role-permission.service';

describe('UserRolePermissionService', () => {
  let service: UserRolePermissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserRolePermissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
