import {inject, Pipe, PipeTransform} from '@angular/core';
import {marked} from 'marked';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

@Pipe({
  name: 'markdown'
})
export class MarkdownPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  transform(value: string |undefined): string | Promise<string> {
    if (!value) {
      return '';
    }
    return marked.parse(value);
  }

}
