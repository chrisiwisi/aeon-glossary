import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlossaryPageComponent } from './glossary-page.component';
import {GlossaryCacheService} from './glossary-cache.service';
import {Rule} from '../rules-card/Rule';
import {SearchService} from '../search/search.service';
import bundledRules from '../../assets/rules.json';

describe('GlossaryPageComponent', () => {
  let component: GlossaryPageComponent;
  let fixture: ComponentFixture<GlossaryPageComponent>;
  let onRules: (rules: Rule[]) => void;
  let onError: (error: Error) => void;
  let disconnect: jasmine.Spy;

  beforeEach(async () => {
    disconnect = jasmine.createSpy('disconnect');
    await TestBed.configureTestingModule({
      imports: [GlossaryPageComponent],
      providers: [
        {
          provide: GlossaryCacheService,
          useValue: {
            connect: (rulesCallback: typeof onRules, errorCallback: typeof onError) => {
              onRules = rulesCallback;
              onError = errorCallback;
              return disconnect;
            },
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

  it('waits for the cache before displaying or indexing rules', () => {
    expect(component.rules()).toEqual([]);
    expect(component.cacheLoading()).toBeTrue();
    expect(fixture.nativeElement.querySelectorAll('app-rules-card').length).toBe(0);
    const loadingStatus = fixture.nativeElement.querySelector('[role="status"]');
    expect(loadingStatus.classList.contains('cache-spinner')).toBeTrue();
    expect(loadingStatus.getAttribute('aria-label')).toBe('Loading glossary');
    expect(TestBed.inject(SearchService).search(bundledRules[0].name).length).toBe(0);
  });

  it('renders and indexes live cache updates', async () => {
    const rules: Rule[] = [{id: 'cached-rule', name: 'Cached glossary entry', rule: 'Live rules', keywords: []}];
    onRules(rules);
    await fixture.whenStable();

    expect(component.rules()).toEqual(rules);
    expect(component.cacheLoading()).toBeFalse();
    expect(fixture.nativeElement.querySelectorAll('app-rules-card').length).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('Cached glossary entry');
    expect(fixture.nativeElement.querySelector('[role="status"]')).toBeNull();
    expect(TestBed.inject(SearchService).search('Cached')[0].id).toBe('cached-rule');
  });

  it('loads bundled rules as fallback when the cache is missing or unavailable', async () => {
    const error = new Error('Missing glossary cache');
    const logError = spyOn(console, 'error');
    onError(error);
    await fixture.whenStable();

    expect(component.rules()).toEqual(bundledRules);
    expect(component.cacheLoading()).toBeFalse();
    expect(fixture.nativeElement.querySelectorAll('app-rules-card').length).toBe(bundledRules.length);
    expect(TestBed.inject(SearchService).search(bundledRules[0].name).length).toBeGreaterThan(0);
    expect(fixture.nativeElement.querySelector('[role="status"]').textContent).toContain('Live glossary updates are unavailable');
    expect(logError).toHaveBeenCalledWith('Could not load glossary cache.', error);
  });

  it('replaces fallback rules with cached rules when the cache recovers', async () => {
    spyOn(console, 'error');
    onError(new Error('Missing glossary cache'));
    const rules: Rule[] = [{id: 'cached-rule', name: 'Cached glossary entry', rule: 'Live rules', keywords: []}];
    onRules(rules);
    await fixture.whenStable();

    expect(component.rules()).toEqual(rules);
    expect(fixture.nativeElement.querySelectorAll('app-rules-card').length).toBe(1);
    expect(TestBed.inject(SearchService).search('Cached')[0].id).toBe('cached-rule');
    expect(component.cacheError()).toBe('');
  });

  it('retains the last valid cache after a failure and clears the warning on recovery', () => {
    spyOn(console, 'error');
    const rules: Rule[] = [{id: 'cached-rule', name: 'Cached glossary entry', rule: 'Live rules', keywords: []}];
    onRules(rules);
    onError(new Error('Permission denied'));

    expect(component.rules()).toEqual(rules);
    expect(component.cacheError()).not.toBe('');

    onRules(rules);
    expect(component.cacheError()).toBe('');
  });

  it('disconnects from the cache when destroyed', () => {
    fixture.destroy();
    expect(disconnect).toHaveBeenCalled();
  });
});
