import { TestBed } from '@angular/core/testing';
import {provideRouter} from "@angular/router";
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render sidebar toggle button', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.burger-button')).toBeTruthy();
  });

  it('should keep the sidebar in the layout and toggle it', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.app-shell')?.classList.contains('ant-layout-has-sider')).toBeTrue();
    expect(compiled.querySelector('app-sidebar .sidebar-menu')).toBeTruthy();
    expect(fixture.componentInstance.isSidebarCollapsed).toBeTrue();

    compiled.querySelector<HTMLButtonElement>('.burger-button')!.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.isSidebarCollapsed).toBeFalse();
    expect(compiled.querySelector('.sidebar-backdrop')).toBeTruthy();
  });
});
