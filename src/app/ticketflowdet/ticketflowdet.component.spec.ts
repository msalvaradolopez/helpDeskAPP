import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketflowdetComponent } from './ticketflowdet.component';

describe('TicketflowdetComponent', () => {
  let component: TicketflowdetComponent;
  let fixture: ComponentFixture<TicketflowdetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketflowdetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketflowdetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
