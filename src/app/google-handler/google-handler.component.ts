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
    console.log("Back from google.");
    console.log("Just back: ", this.justBackFromGoogle);
    let res = "back";
    let flag = this.cookies.get("sentToGoogle");
    console.log("flag: ", flag);
    if (flag === 'true') {
      this.cookies.delete('sentToGoogle');            
    } else {
      console.log("multiple processing");
      res = "multiple processing";
    }
    let code = this.route.snapshot.queryParamMap.get('code');
    console.log("Code: ", code);
    let domain = window.location.protocol + "//" + window.location.hostname;
    if (window.location.port.length > 0) domain += ":" + window.location.port;  
    console.log("Just back: ", this.justBackFromGoogle);
    this.justBackFromGoogle=false;
    console.log("Just back: ", this.justBackFromGoogle);
    let url = this.constants.apiTarget() +"/google?code=" + code +
    "&useCaller=true" +        
    "&domain=" + domain;        
    console.log(url);
    let session = this.http.get<DTLogin>(url).subscribe(data => {           
      console.log("Data: ", data);           
      this.sessionId=data.session;            
      this.cookies.set(this.constants.dtSessionKey(), data.session, 7);          
      console.log("Session Id changed to: " + this.sessionId) 
      window.location.href = domain;      
    });      
    return res;
  }

  notWaiting(): boolean {
    return !this.waiting();
  }
  waiting(): boolean {
    let waitingCookie = this.cookies.get("WaitingForAPI");    
    if (waitingCookie == undefined || waitingCookie == null || waitingCookie != "Waiting") { return false; }
    return true;
  }

  getCode(): string {
    console.log("Starting goggle handlers");
    console.log("Session id: " + this.sessionId);
    console.log("Url: " + window.location.href);
    console.log("Code: " + this.route.snapshot.queryParamMap.get('code'));
    console.log("Waiting for api: " + this.waiting());
    let code = this.route.snapshot.queryParamMap.get('code');
    let domain = window.location.protocol + "://" + window.location.hostname;
    if (window.location.port.length > 0) domain += ":" + window.location.port;  
    if (this.sessionId == undefined || this.sessionId == "") {
      this.sessionId = this.cookies.get(this.constants.dtSessionKey());
    }
    console.log("Session id from cookie: ", this.sessionId, this.sessionId.length);
    if (this.sessionId != null && this.sessionId != 'null' && this.sessionId.length > 0) {
      console.log("Found a session id.");
      let redirect = window.location.protocol + "//" + domain;
      window.location.href = redirect;
      return this.sessionId;
    }    
    let waitingCookie = this.cookies.get("WaitingForAPI");        
    console.log("resetting login.");        
    let url = window.location.href;               
    console.log("Parsed code: " + code);      
    url = this.constants.apiTarget() +"/google?code=" + code +
      "&useCaller=true" +        
      "&domain=" + domain;        
      console.log(url);        
      this.cookies.set("WaitingForAPI", "Waiting");        
      let session = this.http.get<DTLogin>(url).subscribe(data => {           
        console.log("Data: ", data);           
        this.sessionId=data.session;            
        this.cookies.set(this.constants.dtSessionKey(), data.session, 7);          
        this.cookies.delete("WaitingForAPI");          
        console.log("Session Id changed to: " + this.sessionId)         
      });      
      console.log("Response: ", this.sessionId);            
      return this.cookies.get(this.constants.dtSessionKey());
  } 
}
