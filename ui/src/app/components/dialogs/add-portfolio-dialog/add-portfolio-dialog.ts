import { Component, OnInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material-imports';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { createPortfolio, PortfolioModel } from '../../../models/portfolio-model';

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
export class AddPortfolioDialog implements OnInit{

  portfolio_model: PortfolioModel = createPortfolio();

  ngOnInit(){
    this.portfolio_model.user_id = 'baosiek'
  }

  save() {
    console.log("Saved portfolio: ", this.portfolio_model);
  }


}
