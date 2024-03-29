import {Component} from "@angular/core";
import {NgForOf} from "@angular/common";

import {NgbAlert} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'alert-list',
  standalone: true,
  template: `
    <ng-container *ngFor="let alert of alertList">
      <ngb-alert class="text-center "  [type]="alert.type" (closed)="closeAlert(alert.id)">
        {{ alert.message }}



      </ngb-alert>
    </ng-container>
  `,
  imports: [



    NgForOf,
    NgbAlert
  ]
})

export class AppComponentAlertList {
  alertList: Array<{ id:number;type: string; message: string }> = [];
  private nextId = 0;
  addAlert(type: string, message: string) {
    var currentID=this.nextId++;

    this.alertList.push({ id:currentID,type, message });

    setTimeout(() => this.closeAlert(currentID), 10000);

  }


  closeAlert(id: number) {

    this.alertList = this.alertList.filter(alert => alert.id !== id);
  }

}
