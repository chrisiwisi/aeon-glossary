import {Component, inject, output, ViewChild, ElementRef} from '@angular/core';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {NzModalService} from 'ng-zorro-antd/modal';
import {CodeNoteData} from '../storage/code-note-storage.strategy';
import {NzDropdownDirective, NzDropdownMenuComponent} from "ng-zorro-antd/dropdown";
import {NzMenuDirective, NzMenuItemComponent} from "ng-zorro-antd/menu";

@Component({
  selector: 'app-backup-restore',
  imports: [NzButtonComponent, NzIconDirective, NzDropdownMenuComponent, NzMenuDirective, NzMenuItemComponent, NzDropdownDirective],
  templateUrl: './backup-restore.component.html',
  styles: [`
    :host { display: inline-flex; flex: none; }
    .backup-button { display: inline-flex; align-items: center; gap: 7px; height: 34px; padding: 0 13px; color: #d9e3e5; background: transparent; border: 1px solid #587486; border-radius: 4px; font-weight: 600; }
    .backup-button:hover, .backup-button:focus-visible { color: #fff4e1; border-color: #9bbdbf; background: #1b3b50; }
    .chevron { margin-left: 2px; font-size: 16px; line-height: 1; transform: translateY(-3px); }
    @media (max-width: 768px) { .backup-button { height: 30px; padding: 0 9px; font-size: 11px; } }
  `],
})
export class BackupRestoreComponent {
  private modal = inject(NzModalService);

  @ViewChild('fileInput') private fileInput!: ElementRef<HTMLInputElement>;

  readonly exported = output<void>();

  readonly imported = output<CodeNoteData>();

  triggerExport(): void {
    this.exported.emit();
  }

  triggerImport(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target!.result as string) as CodeNoteData;
        if (!Array.isArray(data?.alphabet) || !Array.isArray(data?.messages)) {
          throw new Error('Invalid structure');
        }
        this.imported.emit(data);
      } catch {
        this.modal.error({
          nzTitle: 'Invalid file',
          nzContent: 'The selected file is not a valid backup.',
        });
      }
    };
    reader.readAsText(file);
  }
}
