import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserService} from "./app.service.user";
import {catchError, throwError, timeout} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  responsePortfolioData:any;
  isLoading:boolean=false;

  constructor(private http: HttpClient,public  userService: UserService) {
    this.getLatestPortfolioData();
  }

  getLatestPortfolioData(){
    this.isLoading=true;
    this.http.get<any>('http://localhost:3000/api/portfolio?userid='+ this.userService.getUserId()).subscribe(data => {

      this.responsePortfolioData = data;
      this.isLoading=false;
      console.log(this.responsePortfolioData);


  });



  }

  sendBuyStockRequest(userid: string, quantity: number, ticker: string) {
    const url = 'http://localhost:3000/api/portfolio/buy';
    const body = {userid, quantity, ticker};

    return this.http.post(url, body)

  }

  sendSellStockRequest(userid: string, quantity: number, ticker: string) {
    const url = 'http://localhost:3000/api/portfolio/sell';
    const body = {userid, quantity, ticker};

    return this.http.post(url, body)

  }

}
