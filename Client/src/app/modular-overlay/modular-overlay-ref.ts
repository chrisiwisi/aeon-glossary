import { OverlayRef } from '@angular/cdk/overlay';

export class ModularOverlayRef {
  constructor(private overlayRef: OverlayRef) {
  }

  close(): void {
    this.overlayRef.dispose();
  }
}
