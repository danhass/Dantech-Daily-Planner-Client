import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DtData } from '../services/dt-data-store.service';
import { dtConstants} from '../services/dt-constants.service';

@Component({
  selector: 'app-dt-user-credentials',
  templateUrl: './dt-user-credentials.component.html',
  styleUrls: ['./dt-user-credentials.component.less']
})
export class DtUserCredentialsComponent {

  newPW: string = '';

  constructor (
    public data: DtData,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
  }

  hideCredentialsForm(): void {
    this.data.showLoginDialog = false;
  }

  setPassword(): void {
    this.data.showLoginDialog = false;
    if (this.newPW && this.newPW.length > 0) {
      const url = dtConstants.apiTarget + dtConstants.setPWEndPoint + "?sessionId=" + this.data.sessionId + "&pw=" + this.newPW;  
      let res = this.http.get<any>(url).subscribe(data => {
        //if (data) console.log(data);
      });
    }
  }
}
