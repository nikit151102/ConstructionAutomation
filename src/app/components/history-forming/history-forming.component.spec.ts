import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryFormingComponent } from './history-forming.component';

describe('HistoryFormingComponent', () => {
  let component: HistoryFormingComponent;
  let fixture: ComponentFixture<HistoryFormingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryFormingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoryFormingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
