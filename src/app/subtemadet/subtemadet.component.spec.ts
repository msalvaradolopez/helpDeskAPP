import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtemadetComponent } from './subtemadet.component';

describe('SubtemadetComponent', () => {
  let component: SubtemadetComponent;
  let fixture: ComponentFixture<SubtemadetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubtemadetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubtemadetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
