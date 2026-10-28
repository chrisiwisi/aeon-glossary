import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AionComponent } from './aion.component';
import {AionService} from './aion.service';
import {FullThreadDTO} from './DTOs/FullThreadDTO';
import {of, Subject, throwError} from 'rxjs';

describe('AionComponent', () => {
  let component: AionComponent;
  let fixture: ComponentFixture<AionComponent>;
  let aionService: jasmine.SpyObj<AionService>;
  const thread: FullThreadDTO = {object: 'list', data: [], first_id: '', last_id: '', has_more: false};

  beforeEach(async () => {
    aionService = jasmine.createSpyObj<AionService>('AionService', ['getFullThread', 'promptAndAwaitResponse']);
    aionService.getFullThread.and.returnValue(of(thread));
    aionService.promptAndAwaitResponse.and.returnValue(of(thread));
    await TestBed.configureTestingModule({
      imports: [AionComponent],
      providers: [{provide: AionService, useValue: aionService}]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('only connects when opened and reuses the loaded thread', () => {
    expect(aionService.getFullThread).not.toHaveBeenCalled();
    component.toggleChatbox();
    component.toggleChatbox();
    component.toggleChatbox();

    expect(aionService.getFullThread).toHaveBeenCalledTimes(1);
    expect(component.threadLoaded()).toBeTrue();
    expect(component.disabled()).toBeFalse();
  });

  it('does not duplicate a pending connection', () => {
    const pending = new Subject<FullThreadDTO>();
    aionService.getFullThread.and.returnValue(pending);
    component.toggleChatbox();
    component.toggleChatbox();
    component.toggleChatbox();

    expect(aionService.getFullThread).toHaveBeenCalledTimes(1);
    pending.next(thread);
    pending.complete();
    expect(component.loading()).toBeFalse();
  });

  it('hides and disables chat when the connection fails without retrying', async () => {
    aionService.getFullThread.and.returnValue(throwError(() => new Error('Connection refused')));
    component.toggleChatbox();
    await fixture.whenStable();

    expect(component.disabled()).toBeTrue();
    expect(component.loading()).toBeFalse();
    expect(component.chatBox).toBeFalse();
    expect(fixture.nativeElement.querySelector('.chatbot-icon')).toBeNull();
    expect(fixture.nativeElement.querySelector('.chatbox')).toBeNull();

    component.toggleChatbox();
    component.handleMessage('Hello');
    expect(aionService.getFullThread).toHaveBeenCalledTimes(1);
    expect(aionService.promptAndAwaitResponse).not.toHaveBeenCalled();
  });

  it('also disables chat when sending a message fails', () => {
    component.toggleChatbox();
    aionService.promptAndAwaitResponse.and.returnValue(throwError(() => new Error('Connection refused')));
    component.handleMessage('Hello');

    expect(component.disabled()).toBeTrue();
    expect(component.chatBox).toBeFalse();
    component.handleMessage('Retry');
    expect(aionService.promptAndAwaitResponse).toHaveBeenCalledTimes(1);
  });
});
