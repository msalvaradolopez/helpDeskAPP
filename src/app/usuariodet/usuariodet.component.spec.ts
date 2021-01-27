import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariodetComponent } from './usuariodet.component';

describe('UsuariodetComponent', () => {
  let component: UsuariodetComponent;
  let fixture: ComponentFixture<UsuariodetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuariodetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuariodetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
