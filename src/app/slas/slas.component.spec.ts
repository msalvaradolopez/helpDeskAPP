import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlasComponent } from './slas.component';

describe('SlasComponent', () => {
  let component: SlasComponent;
  let fixture: ComponentFixture<SlasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
