import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterCanvasComponent } from './letter-canvas.component';

describe('ModularOverlayComponent', () => {
  let component: LetterCanvasComponent;
  let fixture: ComponentFixture<LetterCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LetterCanvasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LetterCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
