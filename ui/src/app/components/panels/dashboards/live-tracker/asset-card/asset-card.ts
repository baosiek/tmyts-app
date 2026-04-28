import { Component, input } from '@angular/core';
import { PortfolioHoldingsModel } from '../../../../../models/portfolio_holdings_model';

@Component({
  selector: 'app-asset-card',
  imports: [],
  templateUrl: './asset-card.html',
  styleUrl: './asset-card.scss'
})
export class AssetCard {

  /**
   * Class variables
   */
  asset = input.required<PortfolioHoldingsModel>();

}
