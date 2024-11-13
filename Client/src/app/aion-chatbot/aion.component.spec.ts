import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AionComponent } from './aion.component';

describe('AionComponent', () => {
  let component: AionComponent;
  let fixture: ComponentFixture<AionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
