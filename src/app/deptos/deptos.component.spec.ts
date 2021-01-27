import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeptosComponent } from './deptos.component';

describe('DeptosComponent', () => {
  let component: DeptosComponent;
  let fixture: ComponentFixture<DeptosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeptosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeptosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
