import {ComponentRef, Injectable, InjectionToken, Injector} from "@angular/core";
import {Overlay, OverlayConfig, OverlayRef} from "@angular/cdk/overlay";
import {ModularOverlayRef} from "./modular-overlay-ref";
import {ComponentPortal} from "@angular/cdk/portal";
import {ModularOverlayComponent} from "./modular-overlay.component";
import {FILE_PREVIEW_DIALOG_DATA} from "./modular-overlay.tokens";

interface FilePreviewDialogConfig {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
  message?: string;
  injector?: InjectionToken<any>;
}

const DEFAULT_CONFIG: FilePreviewDialogConfig = {
  hasBackdrop: true,
  backdropClass: 'dark-backdrop',
  panelClass: 'tm-file-preview-dialog-panel',
  message: '',
  injector: FILE_PREVIEW_DIALOG_DATA
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

  open(config: FilePreviewDialogConfig = {}) {
    const dialogConfig = { ...DEFAULT_CONFIG, ...config };
    const overlayRef = this.createOverlay(dialogConfig);
    // Instantiate remote control
    const dialogRef = new ModularOverlayRef(overlayRef);

    this.attachDialogContainer(overlayRef, dialogConfig, dialogRef);
    overlayRef.backdropClick().subscribe(_ => dialogRef.close());
    return dialogRef;
  }

  private createOverlay(config: FilePreviewDialogConfig) {
    const overlayConfig = this.getOverlayConfig(config);
    return this.overlay.create(overlayConfig);
  }

  private attachDialogContainer(overlayRef: OverlayRef, config: FilePreviewDialogConfig, dialogRef: ModularOverlayRef) {
    const injector = this.createInjector(config, dialogRef);

    const containerPortal = new ComponentPortal(ModularOverlayComponent, null, injector);
    const containerRef: ComponentRef<ModularOverlayComponent> = overlayRef.attach(containerPortal);

    return containerRef.instance;
  }

  private createInjector(config: FilePreviewDialogConfig, dialogRef: ModularOverlayRef): Injector {
    return Injector.create({
      parent: this.injector,
      providers: [
        {provide: ModularOverlayRef, useValue: dialogRef},
        {provide: config.injector, useValue: config.message}
      ]
    });
  }

  private getOverlayConfig(config: FilePreviewDialogConfig): OverlayConfig {
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
