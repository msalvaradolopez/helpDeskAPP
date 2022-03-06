import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SucursalesmasterComponent } from './sucursalesmaster.component';

describe('SucursalesmasterComponent', () => {
  let component: SucursalesmasterComponent;
  let fixture: ComponentFixture<SucursalesmasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SucursalesmasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SucursalesmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
