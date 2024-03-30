import { Injectable } from '@angular/core';
import {Options} from "highcharts";
import {HttpClient} from "@angular/common/http";
import {UserService} from "./app.service.user";

@Injectable({
  providedIn: 'root'
})
export class SearchService {


  lastSearchStock:String='';


  responseProfileData:any;
  responseQuoteData:any;
  responsePeerData:any;
  responseNewsData:any;

  showSearchResult: boolean = false;
  currentTime:string='';

  responseInsiderData!:{ positiveMsprSum: any; negativeMsprSum: any; totalMsprSum: any; positiveChangeSum: any; negativeChangeSum: any; totalChangeSum: any; };
  hourChartOptions!: Options;
  yearChartOptions!: Options;
  recommendChartOptions!: any;
  epsChartOptions!: any;
  isSearching:boolean=false;

constructor(private http: HttpClient,public  userService: UserService) {
}


  searchStock(symbol:string) {


  if (symbol!=this.lastSearchStock){



    this.lastSearchStock=symbol;

    this.isSearching=true;
    this.showSearchResult=false;



    this.currentTime=this.getFormattedCurrentDate();



    console.log("search performed "+symbol);

    this.http.get<any>('https://cs571a3-418806.uc.r.appspot.com/api/profile?symbol=' + symbol).subscribe(data => {

      this.responseProfileData = data;

    });

    this.http.get<any>('https://cs571a3-418806.uc.r.appspot.com/api/quote?symbol=' + symbol).subscribe(data => {

      this.responseQuoteData = data;
      var linecolor:string;
      if (this.responseQuoteData.dp>0){
        linecolor='#28d318';
      }
      else if (this.responseQuoteData.dp<0) {
        linecolor='#ea0606';
      }
      else {
        linecolor='#000000';
      }
      this.http.get<any>('https://cs571a3-418806.uc.r.appspot.com/api/hourStockPrice?symbol=' +symbol).subscribe(data => {


        this.hourChartOptions={
          chart: {
            backgroundColor: '#f5f5f5'
          },
          plotOptions: {
            series: {
              marker: {
                enabled: false
              }
            }
          },
          title: {
            text: symbol+" Hourly Price Variation",
            style: {
              color: '#808b93',
              fontSize:'0.9rem'
            }
          },
          xAxis: {
            type: 'datetime',
            title: {
              text: ''
            }
          },

          legend: {
            enabled: false
          },
          yAxis: {
            opposite: true,
            title: {
              text: ''
            },
            labels: {
              y: -5 ,
              x:-5
            },



          },

          time: {
            timezone: 'America/Los_Angeles'
          },
          series: [{
            name: symbol,
            data: data.map(({ c, t }: { c: number, t: number }) => [t, c]),
            type: 'line',
            color:linecolor
          }

          ]
        };


      });







    });





    this.http.get<any>('https://cs571a3-418806.uc.r.appspot.com/api/peers?symbol=' + symbol).subscribe(data => {

      this.responsePeerData = data;
    });


    this.http.get<any>('https://cs571a3-418806.uc.r.appspot.com/api/news?symbol=' + symbol).subscribe(data => {

      this.responseNewsData = data;
    });




    this.http.get<any>('https://cs571a3-418806.uc.r.appspot.com/api/yearStockPrice?symbol=' + symbol).subscribe(data => {



      const ohlc: number[][] = [];
      const volume: number[][] = [];

      data.forEach((item: { v: number; vw: number; o: number; c: number; h: number; l: number; t: number;n: number;  }) => {
        ohlc.push([
          item.t,
          item.o,
          item.h,
          item.l,
          item.c
        ]);

        volume.push([
          item.t,
          item.v
        ]);
      });




      this.yearChartOptions={

        chart: {
          backgroundColor: 'rgba(246,244,244,0.82)',
          events: {
            load() {
              const chart = this,
                startDate = Date.now() - 6 * 30 * 24 * 3600 * 1000,
                endDate = Date.now()

              chart.xAxis[0].setExtremes(startDate,endDate)
            }
          }
        },

        rangeSelector: {
          enabled: true,
          buttons: [{
            type: 'month',
            count: 1,
            text: '1m'
          }, {
            type: 'month',
            count: 3,
            text: '3m'
          }, {
            type: 'month',
            count: 6,
            text: '6m'
          }, {
            type: 'ytd',
            text: 'YTD'
          }, {
            type: 'year',
            count: 1,
            text: '1y'
          }, {
            type: 'all',
            text: 'All'
          }],
          selected: 2
        },
        navigator: {
          enabled: true
        },



        title: {
          text: symbol+' Historical'
        },

        subtitle: {
          text: 'With SMA and Volume by Price technical indicators'
        },

        xAxis: {
          type: 'datetime',
        },

        yAxis: [{
          startOnTick: false,
          endOnTick: false,
          labels: {
            align: 'right',
            x: -3
          },
          title: {
            text: 'OHLC'
          },
          opposite: true,
          height: '60%',
          lineWidth: 2,
          resize: {
            enabled: true
          }
        }, {
          labels: {
            align: 'right',
            x: -3
          },
          title: {
            text: 'Volume'
          },
          opposite: true,
          top: '65%',
          height: '35%',
          offset: 0,
          lineWidth: 2
        }],

        tooltip: {
          split: true
        },
        legend: {
          enabled: false
        },

        plotOptions: {




          series: {
            dataGrouping: {
              units: [[
                'week',
                [1]
              ], [
                'month',
                [1, 2, 3, 4,6]
              ]]
            }
          }
        },

        series: [{
          type: 'candlestick',
          name: symbol,
          id: 'candle',
          zIndex: 2,
          data: ohlc
        }, {
          type: 'column',
          name: 'Volume',
          id: 'volume',
          grouping:true,
          data: volume,
          yAxis: 1
        }, {
          type: 'vbp',
          linkedTo: 'candle',
          params: {
            volumeSeriesID: 'volume'
          },
          dataLabels: {
            enabled: false
          },
          zoneLines: {
            enabled: false
          }
        }, {
          type: 'sma',
          linkedTo: 'candle',
          zIndex: 1,
          marker: {
            enabled: false
          }
        }

        ],


        time: {
          timezone: 'America/Los_Angeles'
        },

      };


    });

    this.http.get<any>('https://cs571a3-418806.uc.r.appspot.com/api/insider?symbol=' + symbol).subscribe(data => {





      this.responseInsiderData = data.reduce((acc: { positiveMsprSum: any; negativeMsprSum: any; totalMsprSum: any; positiveChangeSum: any; negativeChangeSum: any; totalChangeSum: any; }, item: { mspr: number; change: number; }) => {
        acc.positiveMsprSum += item.mspr > 0 ? item.mspr : 0;
        acc.negativeMsprSum += item.mspr < 0 ? item.mspr : 0;
        acc.totalMsprSum += item.mspr;

        acc.positiveChangeSum += item.change > 0 ? item.change : 0;
        acc.negativeChangeSum += item.change < 0 ? item.change : 0;
        acc.totalChangeSum += item.change;

        return acc;
      }, { positiveMsprSum: 0, negativeMsprSum: 0, totalMsprSum: 0, positiveChangeSum: 0, negativeChangeSum: 0, totalChangeSum: 0 });
    });


    this.http.get<any>('https://cs571a3-418806.uc.r.appspot.com/api/recommendation?symbol=' + symbol).subscribe(data => {

      this.recommendChartOptions = {
        chart: {
          backgroundColor: '#f5f5f5',
          type: 'column'
        },

        title: {
          text: 'Recommendation Trends'
        },
        xAxis: {
          categories: data.map((item: { period: any; }) => item.period.substring(0, 7))
        },
        yAxis: {
          min: 0,
          title: {
            text: '# Analysis'
          },

        },
        legend: {
          align: 'center',
          verticalAlign: 'bottom',
          floating: false,

          shadow: false,

        },
        tooltip: {
          headerFormat: '<b>{point.x}</b><br/>',
          pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
        },
        plotOptions: {
          column: {
            stacking: 'normal',
            dataLabels: {
              enabled: true
            }
          }
        },

        series: [
          {
            name: 'Strong Buy',
            data: data.map((item: { strongBuy: any; }) => item.strongBuy),
            color: '#207a3a'
          },
          {
            name: 'Buy',
            data: data.map((item: { buy: any; }) => item.buy)
            ,color: '#2bce57'
          },

          {
            name: 'Hold',
            data:data.map((item: { hold: any; }) => item.hold),
            color: '#b78e24'
          },
          {
            name: 'Sell',
            data: data.map((item: { sell: any; }) => item.sell),
            color: '#e54c5e'
          },
          {
            name: 'Strong Sell',
            data: data.map((item: { strongSell: any; }) => item.strongSell),
            color: '#7b2832'
          }
        ]



      };




    });






    this.http.get<any>('https://cs571a3-418806.uc.r.appspot.com/api/earnings?symbol=' + symbol).subscribe(data => {

      this.epsChartOptions = {

        chart: {
          type: 'spline'
        },
        title: {
          text: 'Historical EPS Surprises'
        },
        xAxis: {
          type:'category',



        },
        yAxis: {
          title: {
            text: 'Quarterly EPS'
          },



        },


        tooltip: {
          shared: true,
          crosshairs: true
        },
        series: [{
          name: 'Actual',
          data:data.map((item: { period: any; actual: any;estimate: any; }) => [item.period+"<br>Surprise: "+(item.actual-item.estimate).toFixed(4), item.actual])
        }, {
          name: 'Estimate',
          data:data.map((item: { period: any; actual: any;estimate: any; }) => [item.period+"<br>Surprise: "+(item.actual-item.estimate).toFixed(4), item.estimate])
        }]

      };

    });


    setTimeout(() => {
      this.isSearching = false;
      this.showSearchResult = true;
    }, 400);



  }
  }



  getFormattedCurrentDate(){
    var date=new Date();
    return  date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2) + ' ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2);
  }


  autoUpdateData(){
    this.http.get<any>('https://cs571a3-418806.uc.r.appspot.com/api/quote?symbol=' + this.responseProfileData.ticker).subscribe(data => {

      this.responseQuoteData = data;});


    this.currentTime=this.getFormattedCurrentDate();
    console.log("AUTO UPDATED"+this.currentTime);

  }




}
