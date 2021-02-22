import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamdetComponent } from './paramdet.component';

describe('ParamdetComponent', () => {
  let component: ParamdetComponent;
  let fixture: ComponentFixture<ParamdetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParamdetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamdetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
