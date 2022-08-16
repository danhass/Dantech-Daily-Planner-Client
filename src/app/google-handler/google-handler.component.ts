import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DtConstantsService, DTLogin } from '../dt-constants.service';
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
  justBackFromGoogle = true;
  constructor(private http: HttpClient, 
              private readonly cookies: CookieService,
              private readonly constants: DtConstantsService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  returnFromGoogle(): string {
    let res = "back";
    let flag = this.cookies.get("sentToGoogle");
    if (flag !== 'true') {
      res = "multiple processing";
    }
    let code = this.route.snapshot.queryParamMap.get('code');
    let domain = window.location.protocol + "//" + window.location.hostname;
    if (window.location.port.length > 0) domain += ":" + window.location.port;  
    this.justBackFromGoogle=false;
    let url = this.constants.apiTarget() +"/google?code=" + code +
    "&useCaller=true" +        
    "&domain=" + domain;        
    let session = this.http.get<DTLogin>(url).subscribe(data => {
      this.cookies.delete('sentToGoogle');          
      this.sessionId=data.session;            
      this.cookies.set(this.constants.dtSessionKey(), data.session, 7);          
      window.location.href = domain;      
    });      
    return res;
  }
}
