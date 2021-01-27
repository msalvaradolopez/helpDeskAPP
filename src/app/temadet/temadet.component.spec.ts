import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemadetComponent } from './temadet.component';

describe('TemadetComponent', () => {
  let component: TemadetComponent;
  let fixture: ComponentFixture<TemadetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemadetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemadetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
