import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {SearchService} from "./app.service.search";



@Component({
  selector: 'app-root',
  standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink,RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
constructor(public searchService:SearchService) {
}
  getSearchRoute(): string {
    const lastTicker = this.searchService.lastSearchStock;
    return lastTicker ? '/search/'+ lastTicker : '/search/home';
  }
}
