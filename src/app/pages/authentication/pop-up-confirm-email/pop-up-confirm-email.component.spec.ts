import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpConfirmEmailComponent } from './pop-up-confirm-email.component';

describe('PopUpConfirmEmailComponent', () => {
  let component: PopUpConfirmEmailComponent;
  let fixture: ComponentFixture<PopUpConfirmEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopUpConfirmEmailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopUpConfirmEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
