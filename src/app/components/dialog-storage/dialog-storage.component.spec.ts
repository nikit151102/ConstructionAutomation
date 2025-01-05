import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogStorageComponent } from './dialog-storage.component';

describe('DialogStorageComponent', () => {
  let component: DialogStorageComponent;
  let fixture: ComponentFixture<DialogStorageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogStorageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
