import {Component, inject, input, InputSignal} from '@angular/core';
import {NzCardComponent} from "ng-zorro-antd/card";
import {Letter} from "./Letter";
import {ModularOverlayService} from "../../modular-overlay/modular-overlay.service";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzInputDirective} from "ng-zorro-antd/input";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-letter',
  imports: [
    NzCardComponent,
    NzButtonComponent,
    NzIconDirective,
    NzInputDirective,
    FormsModule
  ],
  templateUrl: './letter.component.html',
  styleUrl: './letter.component.css'
})
export class LetterComponent {
  letter: InputSignal<Letter> = input.required<Letter>();

  private modularOverlayService = inject(ModularOverlayService);

  protected openLetterModular() {
    this.modularOverlayService.openLetterCanvas(this.letter());
  }

  protected updateLetter($event: Event) {
    //TODO
  }
}
