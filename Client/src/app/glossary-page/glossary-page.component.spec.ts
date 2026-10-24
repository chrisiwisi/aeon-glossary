import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlossaryPageComponent } from './glossary-page.component';
import {GlossaryCacheService} from './glossary-cache.service';

describe('GlossaryPageComponent', () => {
  let component: GlossaryPageComponent;
  let fixture: ComponentFixture<GlossaryPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlossaryPageComponent],
      providers: [
        {
          provide: GlossaryCacheService,
          useValue: {
            connect: () => () => undefined,
          },
        },
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GlossaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
