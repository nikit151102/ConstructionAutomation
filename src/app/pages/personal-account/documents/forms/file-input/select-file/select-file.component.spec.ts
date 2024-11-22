import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectFileComponent } from './select-file.component';

describe('SelectFileComponent', () => {
  let component: SelectFileComponent;
  let fixture: ComponentFixture<SelectFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectFileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
