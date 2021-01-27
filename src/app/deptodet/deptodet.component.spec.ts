import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeptodetComponent } from './deptodet.component';

describe('DeptodetComponent', () => {
  let component: DeptodetComponent;
  let fixture: ComponentFixture<DeptodetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeptodetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeptodetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
