import { Component } from '@angular/core';
import { TmytsToolbar } from "../../../sub-components/tmyts-toolbar/tmyts-toolbar";

@Component({
  selector: 'app-assets-analysis',
  imports: [
    TmytsToolbar
  ],
  templateUrl: './assets-analysis.html',
  styleUrl: './assets-analysis.scss'
})
export class AssetsAnalysis {

  protected title: string = "Assets analysis"

}
