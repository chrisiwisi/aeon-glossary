import { OverlayRef } from '@angular/cdk/overlay';
import {EventEmitter, NgModule} from "@angular/core";
import {Subject} from "rxjs";

@NgModule({})
export class ModularOverlayRef {
  onClose: EventEmitter<void> = new EventEmitter();
  sendData: EventEmitter<any> = new EventEmitter();

  constructor(private overlayRef: OverlayRef) {
    this.overlayRef.keydownEvents().subscribe(event => {
      console.log(event.key)
      if (event.key === 'Escape') {
        this.close();
      }
    })
  }

  emit(result: any): void {
    this.sendData.emit(result);
  }

  close(): void {
    this.overlayRef.dispose();
    this.onClose.emit();
  }
}
