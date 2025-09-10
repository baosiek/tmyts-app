import { Component } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material-imports';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-portfolio-dialog',
  imports: [
    ...MATERIAL_IMPORTS,
    FormsModule,
    CommonModule
  ],
  templateUrl: './add-portfolio-dialog.html',
  styleUrl: './add-portfolio-dialog.scss'
})
export class AddPortfolioDialog {

}
