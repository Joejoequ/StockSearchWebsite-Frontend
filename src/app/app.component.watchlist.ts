import {Component, OnInit} from '@angular/core';
import {DecimalPipe, NgForOf, NgIf, NgStyle} from "@angular/common";
import {UserService} from "./app.service.user";
import {HttpClient} from "@angular/common/http";
import {MatOptionModule} from "@angular/material/core";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";


@Component({
  selector: 'app-component-watchlist',
  standalone: true,
  imports: [
    NgForOf,
    MatOptionModule,
    MatProgressSpinnerModule,
    NgIf,
    DecimalPipe,
    NgStyle
  ],
  templateUrl: './app.component.watchlist.html',
  styleUrls: ['./app.component.watchlist.css']
})


export class AppComponentWatchlist {


  isLoading:boolean=false;
  responseWatchlistData:any;
  constructor(private  userService: UserService,private http: HttpClient) {
  }

  ngOnInit(){

    this.isLoading=true;
    this.http.get<any>('http://localhost:3000/api/watchlist?userid=' + this.userService.getUserId()).subscribe(data => {

      this.responseWatchlistData = data;
      this.isLoading=false;
      console.log(this.responseWatchlistData);
    });


  }

    removeFromWatchList(stockSymbol:string) {


        this.http.delete<{message:string}>(`http://localhost:3000/api/watchlist/${this.userService.getUserId()}/${stockSymbol}`).subscribe({
            next: (response) => {
                console.log('Removed from watchlist', response);
                if (response.message == "SUCCESS"){

                    this.responseWatchlistData = this.responseWatchlistData.filter((item: { ticker: string; }) => item.ticker != stockSymbol);

                }

            },
            error: (error) => {
                console.error('Error adding to watchlist', error);
            }
        });
    }




}
