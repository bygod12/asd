import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasSmallComponent } from './canvas-small.component';

describe('CanvasSmallComponent', () => {
  let component: CanvasSmallComponent;
  let fixture: ComponentFixture<CanvasSmallComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CanvasSmallComponent]
    });
    fixture = TestBed.createComponent(CanvasSmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
