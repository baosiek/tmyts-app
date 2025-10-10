import { Component, input, OnInit, signal } from '@angular/core';
import { DialogData } from '../general-dialog/general-dialog';
import { MatButtonModule } from "@angular/material/button";
import { MATERIAL_IMPORTS } from '../../../material-imports';
import { ObvInfo } from '../../../../assets/obv-info'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-info-dialog',
  imports: [
    ...MATERIAL_IMPORTS
],
  templateUrl: './info-dialog.html',
  styleUrl: './info-dialog.scss'
})
export class InfoDialog implements OnInit{
  dialogData = input.required<DialogData>();
  indicatorInfo = signal<SafeHtml>('');
  sanitizedHtmlContent!: SafeHtml;

  constructor(private sanitizer: DomSanitizer){}

  ngOnInit(): void {
    const label = this.dialogData().data.get('dataDialog').label;
    this.sanitizedHtmlContent = this.sanitizer.bypassSecurityTrustHtml(ObvInfo.text);
    this.indicatorInfo.set(this.sanitizedHtmlContent)
  }

}
