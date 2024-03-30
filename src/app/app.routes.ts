




import { Routes } from '@angular/router';

import {AppComponentPortfolio} from "./app.component.portfolio";
import {AppComponentWatchlist} from "./app.component.watchlist";
import {AppComponentSearch} from "./app.component.search";



export const routes: Routes = [

  { path: '', redirectTo: '/search/home', pathMatch: 'full' },
  { path: 'search/home', component: AppComponentSearch},
  { path: 'search/:ticker', component: AppComponentSearch },
  { path: 'watchlist', component:AppComponentWatchlist },
    { path: 'portfolio', component: AppComponentPortfolio },
];


