import { Component } from '@angular/core';
import { DtAuthService } from './dt-auth.service';
import { CookieService } from 'ngx-cookie-service';
import { DtConstantsService, DTLogin, DTPlanItem, DTUser } from './dt-constants.service';
import { HttpClient } from '@angular/common/http';
import { DtPlannerService } from './dt-planner.service';
import { Observable } from 'rxjs';

const sessionId = "";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']  
})
export class AppComponent {
  title = 'DanTech';
  sessionId = "";
  loginComplete = false;

  loginInfo: DTLogin;
  planItems: Array<DTPlanItem> = this.dtPlanner.PlanItems();

  constructor(private readonly dtAuth: DtAuthService,
              private readonly cookies: CookieService,
              private readonly constants: DtConstantsService,
              private http: HttpClient,
              private dtPlanner: DtPlannerService
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
                this.dtPlanner.setSession(this.loginInfo.session);
              }
        });
      }
      this.loginComplete = true;
    }
    return true;
  }

  emailChanged(): void {
    console.log ("Email changed to: ", this.loginInfo.email);
    this.dtPlanner.setSession(this.loginInfo.session);
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
  
