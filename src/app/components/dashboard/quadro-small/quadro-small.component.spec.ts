import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuadroSmallComponent } from './quadro-small.component';

describe('QuadroSmallComponent', () => {
  let component: QuadroSmallComponent;
  let fixture: ComponentFixture<QuadroSmallComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuadroSmallComponent]
    });
    fixture = TestBed.createComponent(QuadroSmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
