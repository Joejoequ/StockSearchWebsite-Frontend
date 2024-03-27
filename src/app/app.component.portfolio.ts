import {Component} from '@angular/core';
import {DecimalPipe, NgForOf, NgIf} from "@angular/common";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";



@Component({
  selector: 'app-component-portfolio',
  standalone: true,
  imports: [
    DecimalPipe,
    MatProgressSpinnerModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './app.component.portfolio.html',
  styleUrls: ['./app.component.portfolio.css']
})
export class AppComponentPortfolio {


}
