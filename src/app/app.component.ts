import { Component } from '@angular/core';
import { DtAuthService } from './dt-auth.service';
import { GoogleApiService, UserInfo } from './google-api.service';
import { CookieService } from 'ngx-cookie-service';
import { DtConstantsService, DTLogin } from './dt-constants.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']  
})
export class AppComponent {
  title = 'DanTech';
  sessionId = "";
  loginComplete = false;

  userInfo?: UserInfo;
  loginInfo: DTLogin;

  constructor(private readonly googleApi: GoogleApiService, 
              private readonly dtAuth: DtAuthService,
              private readonly cookies: CookieService,
              private readonly constants: DtConstantsService,
              private http: HttpClient
              ) {
      this.loginInfo = { session: "", email: "", fName: "", lName: "", message: ""};    
    }

  isLoggedIn(): boolean {
    if (!this.loginComplete ){
      this.sessionId = this.cookies.get(this.constants.dtSessionKey());
      if (this.sessionId != null && this.sessionId.length > 0) {
        let url = this.constants.apiTarget() + this.constants.loginEndpoint() + "?sessionId=" + this.sessionId;
        let res = this.http.get<DTLogin>(url).subscribe(data => {
          this.loginInfo = data;
          if (this.loginInfo == undefined ||
              this.loginInfo.session === 'null' || 
              this.loginInfo.session == null || 
              this.loginInfo.session == undefined ||
              this.loginInfo.session == "" ) {
                this.cookies.delete(this.constants.dtSessionKey());
              } else {
                this.cookies.set(this.constants.dtSessionKey(), data.session, 7);
              }
        });
      }
      this.loginComplete = true;
    }
    return true;
  }

  dtAuthTest(): string {
    return this.dtAuth.test();
  }

  login(): void {
    return this.dtAuth.authenticate();
  }

  validEmail(): boolean {
    return this.loginInfo != undefined && 
           this.loginInfo.email != undefined && 
           this.loginInfo.email != "null" &&
           this.loginInfo.email != null &&
           this.loginInfo.email.length > 0;
  }
  getLogin(): DTLogin | undefined {
    return this.loginInfo
  }

  cookieTest(): string {
    console.log ("Session Id Cookie:" + this.cookies.get(this.constants.dtSessionKey()));
    return this.cookies.get(this.constants.dtSessionKey());
  }
}
  
