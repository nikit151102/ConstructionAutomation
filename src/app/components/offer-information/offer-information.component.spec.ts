import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferInformationComponent } from './offer-information.component';

describe('OfferInformationComponent', () => {
  let component: OfferInformationComponent;
  let fixture: ComponentFixture<OfferInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
