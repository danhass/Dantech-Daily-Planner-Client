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
  loginInfo: DTLogin | undefined;

  constructor(private readonly googleApi: GoogleApiService, 
              private readonly dtAuth: DtAuthService,
              private readonly cookies: CookieService,
              private readonly constants: DtConstantsService,
              private http: HttpClient
              ) {
    /*googleApi.userProfileSubject.subscribe( info => {
      this.userInfo = info;
    })*/
  }

  isLoggedIn(): boolean {
    if (!this.loginComplete ){
      console.log("Attempting to log in.");
      this.sessionId = this.cookies.get(this.constants.dtSessionKey());
      let url = this.constants.apiTarget() + this.constants.loginEndpoint() + "?sessionId=" + this.sessionId;
      console.log("Url: " + url);
      let res = this.http.get<DTLogin>(url).subscribe(data => {
        console.log("Login data: ", data);
        console.log("Session: " + data.session);
        console.log("Email: " + data.email);
        console.log("First name: " + data.fName);
        console.log("Last name: " + data.lName);
        console.log("Message: ", + data.message );
        this.cookies.set(this.constants.dtSessionKey(), data.session, 7);
      });
      this.loginComplete = true;
      console.log ("session id: " + this.sessionId);
    }
    return true;
  }

  logout() {
    this.googleApi.signOut();
  }

  accessToken(): string {
    return this.googleApi.accessToken();
  }

  dtAuthTest(): string {
    return this.dtAuth.test();
  }

  login(): void {
    return this.dtAuth.authenticate();
  }

  getLogin(): DTLogin | undefined {
    return this.loginInfo
  }

  cookieTest(): string {
    console.log ("Session Id Cookie:" + this.cookies.get(this.constants.dtSessionKey()));
    return this.cookies.get(this.constants.dtSessionKey());
  }
}
  
