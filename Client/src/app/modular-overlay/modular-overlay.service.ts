import {ComponentRef, Injectable, InjectionToken, Injector} from "@angular/core";
import {Overlay, OverlayConfig, OverlayRef} from "@angular/cdk/overlay";
import {ModularOverlayRef} from "./modular-overlay-ref";
import {ComponentPortal} from "@angular/cdk/portal";
import {ModularOverlayComponent} from "./modular-overlay.component";
import {LETTER_DATA} from "./modular-overlay.tokens";
import {Letter} from "../code-note/Letter";

interface ModularOverlayDialogConfig {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
  data?: Letter;
  injector?: InjectionToken<any>;
}

const DEFAULT_CONFIG: ModularOverlayDialogConfig = {
  hasBackdrop: true,
  backdropClass: 'dark-backdrop',
  panelClass: 'modular-overlay-panel',
  data: undefined,
  injector: LETTER_DATA
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

  open(config: ModularOverlayDialogConfig = {}) {
    const dialogConfig = { ...DEFAULT_CONFIG, ...config };
    const overlayRef = this.createOverlay(dialogConfig);
    const dialogRef = new ModularOverlayRef(overlayRef);

    this.attachDialogContainer(overlayRef, dialogConfig, dialogRef);
    overlayRef.backdropClick().subscribe(_ => dialogRef.close());
    return dialogRef;
  }

  private createOverlay(config: ModularOverlayDialogConfig) {
    const overlayConfig = this.getOverlayConfig(config);
    return this.overlay.create(overlayConfig);
  }

  private attachDialogContainer(overlayRef: OverlayRef, config: ModularOverlayDialogConfig, dialogRef: ModularOverlayRef) {
    const injector = this.createInjector(config, dialogRef);

    const containerPortal = new ComponentPortal(ModularOverlayComponent, null, injector);
    const containerRef: ComponentRef<ModularOverlayComponent> = overlayRef.attach(containerPortal);

    return containerRef.instance;
  }

  private createInjector(config: ModularOverlayDialogConfig, dialogRef: ModularOverlayRef): Injector {
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
