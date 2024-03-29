import {Component, ViewChild} from '@angular/core';
import {DecimalPipe, NgForOf, NgIf, NgStyle} from "@angular/common";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {PortfolioService} from "./app.service.portfolio";

import {NgbAlert, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { buyStockModal } from './app.modal.buy';
import {AppComponentAlertList} from "./app.component.alertList";
import {sellStockModal} from "./app.modal.sell";


@Component({
  selector: 'app-component-portfolio',
  standalone: true,
  imports: [
    DecimalPipe,
    MatProgressSpinnerModule,
    NgForOf,
    NgIf,
    NgStyle,
    buyStockModal,
    NgbAlert,
    AppComponentAlertList
  ],
  templateUrl: './app.component.portfolio.html',
  styleUrls: ['./app.component.portfolio.css']
})
export class AppComponentPortfolio {


  @ViewChild(AppComponentAlertList) alertListComponent!: AppComponentAlertList;
  constructor(private modalService: NgbModal,public  portfolioService: PortfolioService) {
  }

  ngOnInit(){

    this.portfolioService.getLatestPortfolioData();


  }






  openBuyModal(ticker:string,currentPrice:number) {
    const modalRef = this.modalService.open(buyStockModal);

    modalRef.componentInstance.ticker = ticker;
    modalRef.componentInstance.currentPrice = currentPrice;

    modalRef.componentInstance.purchaseResult.subscribe((success: boolean) => {

      if (success){
        this.alertListComponent.addAlert( "success",ticker+' bought successfully!');
        this.portfolioService.getLatestPortfolioData();
      }
      else{
        this.alertListComponent.addAlert( "warning",ticker+' bought failed');
      }




    });



  }





  openSellModal(ticker:string,currentPrice:number) {
    const modalRef = this.modalService.open(sellStockModal);

    modalRef.componentInstance.ticker = ticker;
    modalRef.componentInstance.currentPrice = currentPrice;

    modalRef.componentInstance.sellResult.subscribe((success: boolean) => {

      if (success){
        this.alertListComponent.addAlert( "danger",ticker+' sold successfully!');
        this.portfolioService.getLatestPortfolioData();
      }
      else{
        this.alertListComponent.addAlert( "warning",ticker+' sold failed');
      }




    });



  }
}
