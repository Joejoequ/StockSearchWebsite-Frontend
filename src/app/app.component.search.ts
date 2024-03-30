import {Component, inject, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';


import {UserService} from "./app.service.user";
import {SearchService} from "./app.service.search";

import {HttpClient} from "@angular/common/http";
import {MatTabsModule} from "@angular/material/tabs";

import {PortfolioService} from "./app.service.portfolio";
import {HighchartsChartModule} from "highcharts-angular";

import {NgbAlert,  NgbModal} from "@ng-bootstrap/ng-bootstrap";
import * as Highcharts from 'highcharts/highstock';
import indicators from 'highcharts/indicators/indicators';
import volumeByPrice from 'highcharts/indicators/volume-by-price';
import DragPanes from 'highcharts/modules/drag-panes';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatOptionModule} from "@angular/material/core";

import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {interval, Observable, of, Subscription, switchMap, tap} from 'rxjs';
import {startWith} from 'rxjs/operators';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';

import { FormBuilder, FormGroup } from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { finalize } from 'rxjs/operators';
import {AppComponentAlertList} from "./app.component.alertList";
import { buyStockModal } from './app.modal.buy';
import {sellStockModal} from "./app.modal.sell";
indicators(Highcharts);
volumeByPrice(Highcharts);
DragPanes(Highcharts);




@Component({
  selector: 'app-component-search',
  standalone: true,
  imports: [CommonModule, FormsModule, NgOptimizedImage, MatTabsModule, HighchartsChartModule, HighchartsChartModule, HighchartsChartModule, MatProgressSpinnerModule, MatAutocompleteModule, MatOptionModule, FormsModule, MatAutocompleteModule, ReactiveFormsModule, AsyncPipe, MatProgressSpinnerModule, NgIf, NgForOf, RouterLink, NgbAlert, AppComponentAlertList],
  templateUrl: './app.component.search.html',
  styleUrls: ['./app.component.search.css']
})
export class AppComponentSearch implements OnInit, OnDestroy{

  form!: FormGroup;
  symbol:string;
  filteredOptions!: Observable<any[]>;
  modalIndex!:number;
  highcharts:typeof Highcharts=Highcharts;

  private modalService = inject(NgbModal);
  autocomplete_isLoading = false;
  private updateSubscription!: Subscription;


  responseIfStockInWatchlist:boolean = false;

  @ViewChild(AppComponentAlertList) alertListComponent!: AppComponentAlertList;

  constructor(public portfolioService:PortfolioService,public  userService: UserService,public searchService:SearchService, private http: HttpClient,private formBuilder: FormBuilder,private route: ActivatedRoute,private router: Router) {

this.symbol='';



  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      symbol: ['']
    });

    // @ts-ignore
    this.filteredOptions = this.form.get('symbol').valueChanges.pipe(
      startWith(''),
      switchMap(value => this.autocompleteFetchData(value || ''))
    );

    this.route.params.subscribe(params => {
      this.symbol = params['ticker'];

      if (this.symbol) {

        this.responseIfStockInWatchlist=false;

        // @ts-ignore
        this.form.get('symbol').setValue(this.symbol);
        this.searchService.searchStock(this.symbol);



        this.http.get<boolean>('https://cs571a3-418806.uc.r.appspot.com/api/watchlist/ifStockInWatchlist?symbol=' + this.symbol+'&userid='+this.userService.getUserId()).subscribe(data => {

          this.responseIfStockInWatchlist = data;

        });
      }

    });


    this.updateSubscription = interval(15000).subscribe(() => {
      if (this.searchService.responseQuoteData&&this.isTrading(this.searchService.responseQuoteData.t)){
      this.searchService.autoUpdateData();}

    });
  }

  ngOnDestroy() {

    this.updateSubscription.unsubscribe();
  }





  addToWatchList() {
    const userId = this.userService.getUserId();
    const stockSymbol = this.searchService.responseProfileData.ticker;

    this.http.post<{message:string}>('https://cs571a3-418806.uc.r.appspot.com/api/watchlist', {
      userid: userId,
      stockSymbol: stockSymbol
    }).subscribe({
      next: (response) => {
        console.log('Added to watchlist', response);
        if (response.message == "SUCCESS"){

          this.responseIfStockInWatchlist=true;
          this.alertListComponent.addAlert("success",stockSymbol+" added to Watchlist");

        }

      },
      error: (error) => {
        console.error('Error adding to watchlist', error);
      }
    });
  }



  removeFromWatchList(userId:string,stockSymbol:string) {


    this.http.delete<{message:string}>(`https://cs571a3-418806.uc.r.appspot.com/api/watchlist/${userId}/${stockSymbol}`).subscribe({
      next: (response) => {
        console.log('Removed from watchlist', response);
        if (response.message == "SUCCESS"){

          this.responseIfStockInWatchlist=false;
          this.alertListComponent.addAlert("danger",stockSymbol+" removed from Watchlist");

        }

      },
      error: (error) => {
        console.error('Error adding to watchlist', error);
      }
    });
  }


   autocompleteFetchData(value: string): Observable<any[]> {

    if (value==''){
      return of([]);
    }

    this.autocomplete_isLoading = true;
    return this.http.get<any[]>('https://cs571a3-418806.uc.r.appspot.com/api/autocomplete?symbol=' + value).pipe(
      finalize(() => this.autocomplete_isLoading = false)
    );
  }

  onSearchFormClear() {
    this.router.navigate(['/search','home']);

  }

  onSearchFormSubmit(){
    const symbol = this.form.get('symbol')?.value;


    this.router.navigate(['/search', symbol]);




  }




  getFormattedDate(timestamp:any){

    var date = new Date(timestamp * 1000);
    return  date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2) + ' ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2);
  }



  isTrading(lastTradingTime:any){
    var lastTrading=new Date(lastTradingTime+300*1000);
    var current=new Date();

    return current<=lastTrading;
  }
  getNewsFormatDate(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  }





  openNewsModal(content: TemplateRef<any>,index:number) {

    this.modalIndex=index;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(

    );
  }


  openBuyModal(ticker:string,currentPrice:number) {
    const modalRef = this.modalService.open(buyStockModal);

    modalRef.componentInstance.ticker = ticker;
    modalRef.componentInstance.currentPrice = currentPrice.toFixed(2);

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

  shouldDisplaySellBtn(tickerToFind:string){

    var result=this.portfolioService.responsePortfolioData.stocks.find((stock:{ticker:string}) => stock.ticker == tickerToFind);
    if (result){
      return true;
    }
    else{
      return false;
    }
  }





}
