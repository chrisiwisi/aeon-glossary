import {Component, inject, output, ViewChild, ElementRef} from '@angular/core';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {NzTooltipDirective} from 'ng-zorro-antd/tooltip';
import {NzModalService} from 'ng-zorro-antd/modal';
import {CodeNoteData} from '../storage/code-note-storage.strategy';
import {NzDropdownDirective, NzDropdownMenuComponent} from "ng-zorro-antd/dropdown";
import {NzMenuDirective, NzMenuItemComponent} from "ng-zorro-antd/menu";

@Component({
  selector: 'app-backup-restore',
  imports: [NzButtonComponent, NzIconDirective, NzTooltipDirective, NzDropdownMenuComponent, NzMenuDirective, NzMenuItemComponent, NzDropdownDirective],
  templateUrl: './backup-restore.component.html',
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

