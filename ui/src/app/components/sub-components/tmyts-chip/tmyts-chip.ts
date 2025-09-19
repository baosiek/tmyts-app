import { Component, ElementRef, Input, input, OnChanges, OnInit, Renderer2, signal, ViewChild } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material-imports';
import { NgStyle } from '@angular/common';

export type ColorSet = {
  color: string;
  background_color: string;
}

@Component({
  selector: 'app-tmyts-chip',
  imports: [
    ...MATERIAL_IMPORTS,
    NgStyle
],
  templateUrl: './tmyts-chip.html',
  styleUrl: './tmyts-chip.scss',
  styles: [
    `:host { 
      display: flex;
      align-items: center;
      font-weight: bold;
      border-radius: 8px;
      max-width: 100%; height: auto;
      padding: 8px 8px;
      gap: 0px
    
    }`
  ],

})
export class TmytsChip {

  @Input() iconName: string = ""
  // iconName = input();

  @Input() textColor: string = '#000'
  // textColor = input();

  @Input() backgroundColorColor: string = '#fff'
  // backgroundColor = input();

  getStyleObject() {
    return {
      "color": this.textColor,
      "background-color": this.backgroundColorColor
    }
  }

}
