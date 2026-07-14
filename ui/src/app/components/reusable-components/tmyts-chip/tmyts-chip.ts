import { Component, ElementRef, Input, input, OnChanges, OnInit, Renderer2, signal, ViewChild } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material-imports';
import { NgClass, NgStyle } from '@angular/common';

export type ColorSet = {
  color: string;
  background_color: string;
}

@Component({
  selector: 'app-tmyts-chip',
  imports: [
    ...MATERIAL_IMPORTS,
    NgClass
],
  templateUrl: './tmyts-chip.html',
  styleUrl: './tmyts-chip.scss',
  styles: [
    `:host {
      display: inline-flex;
      max-width: 100%;
    }`
  ],

})
export class TmytsChip {

  @Input() iconName: string = ""
  @Input() classType: string = 'error-container'

  getStyleObject() {
    return this.classType
  }

}
