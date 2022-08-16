import { Component } from '@angular/core';
import { DtAuthService } from './dt-auth.service';
import { CookieService } from 'ngx-cookie-service';
import { DtConstantsService, DTLogin, DTPlanItem, DTUser } from './dt-constants.service';
import { HttpClient } from '@angular/common/http';
import { DtPlannerService } from './dt-planner.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { WeekDay } from '@angular/common';

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
              private dtPlanner: DtPlannerService,
              private route: ActivatedRoute
              ) {
      this.loginInfo = { session: "", email: "", fName: "", lName: "", message: ""};    
    }

  isLoggedIn(): boolean {
    if (!this.loginComplete ){
      this.sessionId = this.cookies.get(this.constants.dtSessionKey());
      let code = this.route.snapshot.queryParamMap.get('code');
      console.log("Code: ", code);
      let flag = this.cookies.get("sentToGoogle");
      if (flag.length==0 && this.sessionId != null && this.sessionId.length > 0 && (code == null || code?.length == 0)) {
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

  dayOfWeek(date: any): string {
    let theDate = new Date(date);
    return theDate.toLocaleDateString(undefined, {weekday: 'short'}) + " " + 
      ("0" + (theDate.getMonth() +1)).slice(-2) + "-" + 
      ("0" + theDate.getDate()).slice(-2) + "-" +
      theDate.getFullYear();
  }

  emailChanged(): void {
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
    return this.cookies.get(this.constants.dtSessionKey());
  }  
}
  
