import {Component, Inject} from '@angular/core';

@Component({
  selector: 'app-modular-overlay',
  standalone: true,
  imports: [],
  templateUrl: './modular-overlay.component.html',
  styleUrl: './modular-overlay.component.css'
})
export class ModularOverlayComponent {
  constructor(
    public dialogRef: FilePreviewOverlayRef,
    @Inject(FILE_PREVIEW_DIALOG_DATA) public image: any) { }
}
