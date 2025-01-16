import { OverlayRef } from '@angular/cdk/overlay';
import {NgModule} from "@angular/core";

@NgModule({})
export class ModularOverlayRef {
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
  }
}
