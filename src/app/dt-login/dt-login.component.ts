import { Component, Input, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { DtData } from '../dt-data-store.service';
import { ActivatedRoute, TitleStrategy } from '@angular/router';
import { dtConstants, DTLogin } from '../dt-constants.service';
import { HttpClient } from '@angular/common/http';
import { DtPlannerService} from '../dt-planner.service';
import { DtAuthService } from '../dt-auth.service';

@Component({
  selector: 'app-dt-login',
  templateUrl: './dt-login.component.html',
  styleUrls: ['./dt-login.component.less']
})
export class DtLoginComponent implements OnInit {
  @Input() data: DtData | any;

  constructor(
    private readonly dtAuth: DtAuthService,
    private route: ActivatedRoute,
    private http: HttpClient,
    public dtPlanner: DtPlannerService,
    private readonly cookies: CookieService
  ) { }

  ngOnInit(): void {
    if (this.data.loginComplete == undefined || this.data?.loginComplete == false) {
      this.data.sessionId = this.cookies.get(dtConstants.dtSessionKey);
      this.cookies.delete(dtConstants.dtPlannerServiceStatusKey);      
      let code = this.route.snapshot.queryParamMap.get('code');
      let flag = this.cookies.get("sentToGoogle");
      let logginInProgress = this.cookies.get("loginInProgress");
      
      if (flag.length == 0 && (logginInProgress == null || logginInProgress.length == 0) && 
        this.data.sessionId != null && this.data.sessionId.length > 0 && (code == null || code?.length == 0)) {
        this.cookies.set("loginInProgress", "true");
        let url = dtConstants.apiTarget + dtConstants.loginEndpoint + "?sessionId=" + this.data.sessionId;        
        let res = this.http.get<DTLogin>(url).subscribe(data => {          
          this.cookies.delete("loginInProgress");
          this.data.login = data;
          if (this.data.login == undefined ||
            this.data.login.session === 'null' ||
            this.data.login.session == null ||
            this.data.login.session == undefined ||
            this.data.login.session == "") {
            this.cookies.delete(dtConstants.dtSessionKey);
          } else {
            this.cookies.set(dtConstants.dtSessionKey, data.session, 7);
            this.dtPlanner.setSession(this.data.login.session);
          }
          this.dtPlanner.initialize();
          this.dtPlanner.componentMethodCalled$.subscribe((msg) => {
            this.processPlannerServiceResult(msg);
          });
          this.data.loginComplete = true;          
        }); 
      } else {
        this.data.loginComplete = true;
      }      
    }    
  }

  login(): void {
    return this.dtAuth.authenticate();
  }

  processPlannerServiceResult(msg: string): void {    
  }
}
