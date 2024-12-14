import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewPdfComponent } from './preview-pdf.component';

describe('PreviewPdfComponent', () => {
  let component: PreviewPdfComponent;
  let fixture: ComponentFixture<PreviewPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewPdfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
