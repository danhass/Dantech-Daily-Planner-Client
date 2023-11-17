import { Component, OnInit } from '@angular/core';
import { DtData } from '../services/dt-data-store.service';

@Component({
  selector: 'app-dt-user-credentials',
  templateUrl: './dt-user-credentials.component.html',
  styleUrls: ['./dt-user-credentials.component.less']
})
export class DtUserCredentialsComponent {

  constructor (
    public data: DtData
  ) {}

  ngOnInit(): void {
    console.log (this.data);
  }

  hideCredentialsForm(): void {
    console.log("Hide.")
    this.data.showLoginDialog = false;
    console.log(this.data);
  }

}
