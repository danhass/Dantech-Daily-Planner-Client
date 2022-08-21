import { Component } from '@angular/core';
import { DtAuthService } from './dt-auth.service';
import { CookieService } from 'ngx-cookie-service';
import { DtConstantsService, DTLogin, DTPlanItem, DTProject, DTProjectOut, DTUser, DTStatus } from './dt-constants.service';
import { HttpClient } from '@angular/common/http';
import { DtPlannerService, DtProjects } from './dt-planner.service';
import { ActivatedRoute, TitleStrategy } from '@angular/router';
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
  projects: Array<DTProject> = DtProjects;
  projectStati: Array<DTStatus> = this.dtPlanner.Stati();

  //Add project form items
  newProjectTitle: string = '';
  newProjectShortCode: string = '';
  newProjectStatusId: number = 1;

  constructor(private readonly dtAuth: DtAuthService,
              private readonly cookies: CookieService,
              private readonly constants: DtConstantsService,
              private http: HttpClient,
              private dtPlanner: DtPlannerService,
              private route: ActivatedRoute,
              ) {
      this.loginInfo = { session: "", email: "", fName: "", lName: "", message: ""};    
    }

  isLoggedIn(): boolean {
    if (!this.loginComplete ){
      this.sessionId = this.cookies.get(this.constants.values().dtSessionKey);
      this.cookies.delete(this.constants.values().dtPlannerServiceStatusKey);
      let code = this.route.snapshot.queryParamMap.get('code');
      let flag = this.cookies.get("sentToGoogle");
      if (flag.length==0 && this.sessionId != null && this.sessionId.length > 0 && (code == null || code?.length == 0)) {
        let url = this.constants.values().apiTarget + this.constants.values().loginEndpoint + "?sessionId=" + this.sessionId;
        let res = this.http.get<DTLogin>(url).subscribe(data => {
          this.loginInfo = data;
          if (this.loginInfo == undefined ||
              this.loginInfo.session === 'null' || 
              this.loginInfo.session == null || 
              this.loginInfo.session == undefined ||
              this.loginInfo.session == "" ) {
                this.cookies.delete(this.constants.values().dtSessionKey);
              } else {
                this.cookies.set(this.constants.values().dtSessionKey, data.session, 7);
                this.dtPlanner.setSession(this.loginInfo.session);
              }
          this.dtPlanner.initialize();
        });
      }
      this.loginComplete = true;
    }
    return true;
  }

  hasProjects(): boolean {
    if (DtProjects && DtProjects.length > 0) return true;
    return false;
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

  test(): void {
    console.log("Projects now: ", DtProjects, this.projects);    
  }
  
  trackProjectsItem (index: number, project: DTProject): number {
    return project.id;
  }

  addProject(): void {
    let url = this.constants.values().apiTarget + this.constants.values().setProjectEndpoint;
    let hdrs = {'content-type': 'application/x-www-form-urlencoded'};
    this.http.post<[DTProject]>(url, '', {headers: hdrs, params: {
        sessionId: this.sessionId, 
        title: this.newProjectTitle, 
        shortCode: this.newProjectShortCode, 
        status: this.newProjectStatusId}}).subscribe( data => {
          let newProjects: Array<DTProject> = [];
      if (data) { for (let i=0; i < data.length; i++) {  newProjects = [...newProjects, data[i]];  }  }
      this.dtPlanner.setProjects(newProjects);
      this.projects = DtProjects;
    });    
    this.newProjectTitle = '';
    this.newProjectShortCode = '';
    this.newProjectStatusId = 1; 
  }
}
  
