import {ComponentRef, Injectable, InjectionToken, Injector} from "@angular/core";
import {ComponentType, Overlay, OverlayConfig, OverlayRef} from "@angular/cdk/overlay";
import {ModularOverlayRef} from "./modular-overlay-ref";
import {ComponentPortal} from "@angular/cdk/portal";
import {LetterCanvasComponent} from "./letter-canvas/letter-canvas.component";
import {Letter} from "../code-note/Letter";
import {MessageInputComponent} from "./message-input/message-input.component";
import {DIALOG_DATA} from "@angular/cdk/dialog";

interface ModularOverlayDialogConfig {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
  injector?: InjectionToken<any>;
}

const DEFAULT_CONFIG: ModularOverlayDialogConfig = {
  hasBackdrop: true,
  backdropClass: 'dark-backdrop',
  panelClass: 'modular-overlay-panel',
  injector: DIALOG_DATA
}

@Injectable({
  providedIn: 'root'
})
export class ModularOverlayService {
  constructor(
    private injector: Injector,
    private overlay: Overlay
  ) {
  }


  openLetterCanvas(letter: Letter, config: ModularOverlayDialogConfig = {}) {
    return this.open(LetterCanvasComponent, { ...config, data: letter });
  }

  openMessageInput(map: Map<number, Letter>, config: ModularOverlayDialogConfig = {}) {
    return this.open(MessageInputComponent, { ...config, data: map });
  }

  private open<T, D>(component: ComponentType<T>, config: ModularOverlayDialogConfig & { data: D }): ModularOverlayRef {
    const dialogConfig = { ...DEFAULT_CONFIG, ...config };
    const overlayRef = this.createOverlay(dialogConfig);
    const dialogRef = new ModularOverlayRef(overlayRef);

    this.attachDialogContainer(overlayRef, dialogConfig, dialogRef, component);

    overlayRef.backdropClick().subscribe(() => dialogRef.close());

    return dialogRef;
  }

  private createOverlay(config: ModularOverlayDialogConfig) {
    const overlayConfig = this.getOverlayConfig(config);
    return this.overlay.create(overlayConfig);
  }

  private attachDialogContainer<T, D>(
    overlayRef: OverlayRef,
    config: ModularOverlayDialogConfig & { data: D },
    dialogRef: ModularOverlayRef,
    component: ComponentType<T>
  ): T {
    const injector = this.createInjector(config, dialogRef);

    const containerPortal = new ComponentPortal(component, null, injector);
    const containerRef: ComponentRef<T> = overlayRef.attach(containerPortal);

    return containerRef.instance;
  }

  private createInjector<D>(config: ModularOverlayDialogConfig & { data: D }, dialogRef: ModularOverlayRef): Injector {
    return Injector.create({
      parent: this.injector,
      providers: [
        {provide: ModularOverlayRef, useValue: dialogRef},
        {provide: config.injector, useValue: config.data}
      ]
    });
  }

  private getOverlayConfig(config: ModularOverlayDialogConfig): OverlayConfig {
    const positionStrategy = this.overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically();

    return new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy
    });
  }
}
