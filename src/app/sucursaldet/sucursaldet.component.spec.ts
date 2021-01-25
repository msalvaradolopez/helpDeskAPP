import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SucursaldetComponent } from './sucursaldet.component';

describe('SucursaldetComponent', () => {
  let component: SucursaldetComponent;
  let fixture: ComponentFixture<SucursaldetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SucursaldetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SucursaldetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
