import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

export interface session {
  sessionId: string
}

@Component({
  selector: 'app-google-handler',
  templateUrl: './google-handler.component.html',
  styleUrls: ['./google-handler.component.less']
})

export class GoogleHandlerComponent implements OnInit {

  //baseURL: string = "https://localhost:44324/google";
  baseURL: string = "https://7822-54268.el-alt.com/google";
  sessionId = "";
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  getCode(): any {
    if (this.sessionId.length > 0) return this.sessionId;
    let url = window.location.href;
    let domain = window.location.protocol + "//" + window.location.hostname;
    if (window.location.port.length > 0) domain += ":" + window.location.port;
    let start = url.indexOf("code=")+5;
    let end = url.indexOf("&scope", start);
    let code = url.substring(start, end);
    code = decodeURIComponent(code);
    console.log("Parsed code: " + code);
    url = this.baseURL + "?code=" + code +
      "&useCaller=true" +
      "&domain=" + domain;
    console.log(url);
    this.sessionId = "1234";
    let session = this.http.get<session>(url).subscribe(data => { console.log("Data: ", data); this.sessionId=data.sessionId; });
    console.log("Response: " + this.sessionId);
    return this.sessionId;
    //return "X";
 }
}
