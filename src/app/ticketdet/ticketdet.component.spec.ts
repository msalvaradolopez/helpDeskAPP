import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketdetComponent } from './ticketdet.component';

describe('TicketdetComponent', () => {
  let component: TicketdetComponent;
  let fixture: ComponentFixture<TicketdetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketdetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketdetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
