import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzInputDirective} from 'ng-zorro-antd/input';
import {NzModalModule} from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-session-dialog',
  imports: [FormsModule, NzButtonComponent, NzInputDirective, NzModalModule],
  templateUrl: './session-dialog.component.html',
  styleUrl: './session-dialog.component.css',
})
export class SessionDialogComponent implements OnChanges {
  @Input({required: true}) title = '';
  @Input() visible = false;
  @Input() loading = false;
  @Input() error = '';
  @Input() canCancel = false;

  @Output() create = new EventEmitter<void>();
  @Output() join = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();
  @Output() clearError = new EventEmitter<void>();

  joining = false;
  joinCode = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']?.currentValue && !changes['visible'].previousValue) {
      this.joining = false;
      this.joinCode = '';
    }
  }

  showJoin(): void {
    this.clearError.emit();
    this.joining = true;
  }

  showChoices(): void {
    this.clearError.emit();
    this.joining = false;
  }
}
