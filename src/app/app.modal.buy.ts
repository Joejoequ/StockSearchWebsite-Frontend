import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {DecimalPipe, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {PortfolioService} from "./app.service.portfolio";

@Component({
  selector: 'app-modal-buy',
  standalone: true,
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{ticker}}</h4>
      <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
    </div>

    <div class="modal-body px-4">

      <div class="my-1">Current Price:{{currentPrice| number:'1.2-2'}}</div>
      <div class="my-1">Money in Wallet:{{this.portfolioService.responsePortfolioData.balance| number:'1.2-2'}}</div>
      <div class="d-flex my-1">
      <div class="d-flex align-items-center">Quantity:</div> <input min="0" (input)="validateInput($event)" [(ngModel)]="inputQuantity" type="number" id="typeNumber" class="form-control"/></div>
      <label class="text-danger my-1" *ngIf="currentPrice * inputQuantity > this.portfolioService.responsePortfolioData.balance">Not enough money in wallet!</label>
    </div>
    <div class="modal-footer">
      <div class="d-flex justify-content-between w-100">
      <div class="d-flex align-items-center">Total:{{currentPrice*inputQuantity||0.0|number:'1.2-2'}}</div>
      <button type="button" class="btn btn-success" (click)="onBuyBtnClick()" [disabled]="inputQuantity <= 0 || currentPrice * inputQuantity > this.portfolioService.responsePortfolioData.balance">Buy</button>

      </div>
    </div>
  `,
  imports: [
    DecimalPipe,
    FormsModule,
    NgIf
  ]
})
export class buyStockModal {
  activeModal = inject(NgbActiveModal);

  @Input() ticker!: string;
  @Input() currentPrice!: number;

  inputQuantity:number=0;
  @Output() purchaseResult: EventEmitter<any> = new EventEmitter();

  constructor(public portfolioService:PortfolioService) {

  }

  validateInput(event: any) {
    const inputValue = event.target.value;
    if (inputValue < 0) {
      event.target.value = 0;
    }
  }

  onBuyBtnClick(){

    this.portfolioService.sendBuyStockRequest(this.portfolioService.userService.getUserId(), this.inputQuantity, this.ticker).subscribe({
      next: (response) => {

        // @ts-ignore
        if (response.success){

          this.purchaseResult.emit(true);

        }
        else {
          this.purchaseResult.emit(false);
        }

      },
      error: (error) => {
        this.activeModal.close('fail');
      }
    });

    this.activeModal.close();
  }





}
