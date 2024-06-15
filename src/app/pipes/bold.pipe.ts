import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'; // Import DomSanitizer

// Create a custom pipe to convert asterisks to bold tags
@Pipe({
  name: 'boldAsterisks'
})
export class BoldAsterisksPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    const replacedText = value.replace(/\*([^\*]+)\*/g, '<strong>$1</strong>');
    return this.sanitizer.bypassSecurityTrustHtml(replacedText);
  }
}