import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SladetComponent } from './sladet.component';

describe('SladetComponent', () => {
  let component: SladetComponent;
  let fixture: ComponentFixture<SladetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SladetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SladetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
