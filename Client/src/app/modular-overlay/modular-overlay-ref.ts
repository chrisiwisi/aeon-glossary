import { OverlayRef } from '@angular/cdk/overlay';
import {EventEmitter, NgModule} from "@angular/core";

@NgModule({})
export class ModularOverlayRef {
  onClose: EventEmitter<void> = new EventEmitter();

  constructor(private overlayRef: OverlayRef) {
    this.overlayRef.keydownEvents().subscribe(event => {
      console.log(event.key)
      if (event.key === 'Escape') {
        this.close();
      }
    })
  }

  close(): void {
    this.overlayRef.dispose();
    this.onClose.emit();
  }
}
