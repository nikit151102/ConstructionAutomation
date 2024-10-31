import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompStatementComponent } from './comp-statement.component';

describe('CompStatementComponent', () => {
  let component: CompStatementComponent;
  let fixture: ComponentFixture<CompStatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompStatementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
