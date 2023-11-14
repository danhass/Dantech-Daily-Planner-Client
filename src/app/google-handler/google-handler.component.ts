import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { dtConstants, DTLogin } from '../services/dt-constants.service';
import { DtData } from '../services/dt-data-store.service';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';

export interface session {
  sessionId: string
}

@Component({
  selector: 'app-google-handler',
  templateUrl: './google-handler.component.html',
  styleUrls: ['./google-handler.component.less']
})

export class GoogleHandlerComponent implements OnInit {

  sessionId = "";
  delaySet = false;
  cycleCount = 0;
  constructor(private http: HttpClient, 
              private readonly cookies: CookieService,
              private route: ActivatedRoute,
              public data: DtData
              ) { this.data.justBackFromGoogle = true; }

  ngOnInit(): void {
    console.log("Back...");
    console.log(this.data);
  }

  returnFromGoogle(): string {
    this.cycleCount = this.cycleCount + 1;
    this.data.justBackFromGoogle = false;
    console.log(this.cycleCount);
    if (this.cycleCount >= 10) {
      console.log("ERROR!");
    }
    let res = "";
    let serviceFlag = this.cookies.get(dtConstants.dtPlannerServiceStatusKey);
    if(serviceFlag == "initializing") {
        setTimeout(() => { 
        this.delaySet = true;
        this.returnFromGoogle();
       }, 1000);
    }
    else {
      let sentFlag = this.cookies.get("sentToGoogle");
      if (sentFlag == "true"){
        res = "waiting for authentication...";
        let flag = this.cookies.get("sentToGoogle");
        if (flag !== 'true') {
          res = "multiple processing";
        }
        let code = this.route.snapshot.queryParamMap.get('code');
        let domain = window.location.protocol + "//" + window.location.hostname;
        if (window.location.port.length > 0) domain += ":" + window.location.port;  
        let url = dtConstants.apiTarget +"/google?code=" + code +
        "&useCaller=true" +        
        "&domain=" + domain;  
        let session = this.http.get<DTLogin>(url).subscribe(data => {
          this.cookies.delete('sentToGoogle');          
          this.sessionId=data.session;            
          this.cookies.set(dtConstants.dtSessionKey, data.session, 7);          
          window.location.href = domain;      
        });
      }
    }      
    return res;
  }
}
