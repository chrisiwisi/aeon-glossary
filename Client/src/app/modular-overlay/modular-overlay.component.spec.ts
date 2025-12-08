import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModularOverlayComponent } from './modular-overlay.component';

describe('ModularOverlayComponent', () => {
  let component: ModularOverlayComponent;
  let fixture: ComponentFixture<ModularOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModularOverlayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModularOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
