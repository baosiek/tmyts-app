import { Component, input, OnChanges, SimpleChanges } from '@angular/core';
import { IWidgetConfig } from '../../../../../../interfaces/widget-config-interface';
import { DialogData } from '../../../../../dialogs/general-dialog/general-dialog';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-adline-widget',
  imports: [
    JsonPipe
  ],
  templateUrl: './adline-widget.html',
  styleUrl: './adline-widget.scss'
})
export class AdlineWidget implements OnChanges{

  data = input.required<DialogData>();

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(`AdlineWidget Config: ${JSON.stringify(this.data())}`);
  }

}
