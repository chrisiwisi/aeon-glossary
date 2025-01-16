import {Component, Inject} from '@angular/core';
import {ModularOverlayRef} from "./modular-overlay-ref";
import {FILE_PREVIEW_DIALOG_DATA} from "./modular-overlay.tokens";

@Component({
  selector: 'app-modular-overlay',
  imports: [],
  templateUrl: './modular-overlay.component.html',
  standalone: true,
  styleUrl: './modular-overlay.component.css'
})
export class ModularOverlayComponent {
  constructor(
    public dialogRef: ModularOverlayRef,
    @Inject(FILE_PREVIEW_DIALOG_DATA) public message: any) { }
}
