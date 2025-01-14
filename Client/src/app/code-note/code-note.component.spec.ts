import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeNoteComponent } from './code-note.component';

describe('CodeNoteComponent', () => {
  let component: CodeNoteComponent;
  let fixture: ComponentFixture<CodeNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeNoteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CodeNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
