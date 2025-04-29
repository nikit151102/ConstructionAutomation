import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsubscribeMailingComponent } from './unsubscribe-mailing.component';

describe('UnsubscribeMailingComponent', () => {
  let component: UnsubscribeMailingComponent;
  let fixture: ComponentFixture<UnsubscribeMailingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnsubscribeMailingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnsubscribeMailingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
