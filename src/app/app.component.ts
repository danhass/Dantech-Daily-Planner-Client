import { Component } from '@angular/core';
import { DtAuthService } from './dt-auth.service';
import { CookieService } from 'ngx-cookie-service';
import {dtConstants, DTLogin, DTPlanItem, DTProject, DTUser, DTStatus, DTColorCode } from './dt-constants.service';
import { HttpClient } from '@angular/common/http';
import { DtPlannerService, DtProjects } from './dt-planner.service';
import { ActivatedRoute, TitleStrategy } from '@angular/router';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';



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
  projectColorCodes: Array<DTColorCode> = this.dtPlanner.ColorCodes();
  plannerInitializedFlag: boolean = !(this.cookies.check(dtConstants.dtPlannerServiceStatusKey));

  //Add project form elements
  newProjectTitle: string = '';
  newProjectShortCode: string = '';
  newProjectStatusId: number = 1;
  newProjectColorCodeId: number = 0;
  newProjectPriority: number = 1000;
  newProjectSortOrder: number | null = null;
  newProjectNotes: string = "";

  //Add plan items form elements
  newPlanItemTitle: string = '';
  newPlanItemNote: string | null = null ;
  newPlanItemStart: string | null = moment().format("MM/DD/YYYY");
  newPlanItemStartDate: Date = new Date();
  newPlanItemStartTime: string | null = null;
  newPlanItemEnd: string | null = "";
  newPlanItemEndDate: Date = new Date();
  newPlanItemEndTime: string | null = null;
  newPlanItemPriority: number | null = null;
  newPlanItemAddToCalendar: boolean | null = null;
  newPlanItemProjectId: number | null = null;

  constructor(private readonly dtAuth: DtAuthService,
              private readonly cookies: CookieService,
              private http: HttpClient,
              private dtPlanner: DtPlannerService,
              private route: ActivatedRoute,
              private datePipe: DatePipe
              ) {
      this.loginInfo = { session: "", email: "", fName: "", lName: "", message: ""}; 
      this.newPlanItemStart = moment().format("MM/DD/YYYY");
    }  

  isLoggedIn(): boolean {
    if (!this.loginComplete ){
      this.sessionId = this.cookies.get(dtConstants.dtSessionKey);
      this.cookies.delete(dtConstants.dtPlannerServiceStatusKey);
      let code = this.route.snapshot.queryParamMap.get('code');
      let flag = this.cookies.get("sentToGoogle");
      if (flag.length==0 && this.sessionId != null && this.sessionId.length > 0 && (code == null || code?.length == 0)) {
        let url = dtConstants.apiTarget + dtConstants.loginEndpoint + "?sessionId=" + this.sessionId;
        let res = this.http.get<DTLogin>(url).subscribe(data => {
          this.loginInfo = data;
          if (this.loginInfo == undefined ||
              this.loginInfo.session === 'null' || 
              this.loginInfo.session == null || 
              this.loginInfo.session == undefined ||
              this.loginInfo.session == "" ) {
                this.cookies.delete(dtConstants.dtSessionKey);
              } else {
                this.cookies.set(dtConstants.dtSessionKey, data.session, 7);
                this.dtPlanner.setSession(this.loginInfo.session);
              }
          this.dtPlanner.initialize();
          this.dtPlanner.componentMethodCalled$.subscribe((msg) => { 
            this.projects = DtProjects;
            this.planItems = this.dtPlanner.PlanItems();
            this.projectColorCodes = this.dtPlanner.ColorCodes();
            this.plannerInitializedFlag = !(this.cookies.check(dtConstants.dtPlannerServiceStatusKey));
          });
          this.loginComplete = true;
          return true;
        });      
      } else {
        this.loginComplete = true;
        return true;
      }
      return this.loginComplete;
    }
    return this.loginComplete;
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
    return "";
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
    console.log(this.isLoggedIn());     
  }
  
  trackProjectsItem (index: number, project: DTProject): number {
    return project.id;
  }

  togglePlanItemCompleted(itemId: number, event: any): void {
    let completed = event.srcElement.checked;
    let item = (this.planItems.find(x => x.id == itemId) as DTPlanItem);
    let start = new Date(item.start);
    let end = new Date(item.start);
    end.setHours(start.getHours() + item.duration.hours);
    end.setMinutes(start.getMinutes() + item.duration.minutes);
    let endTime = end.getHours().toString().padStart(2, "0")  + ":" + end.getMinutes().toString().padStart(2, "0");
    let url = dtConstants.apiTarget + dtConstants.setPlanItemEndPoint;
    let hdrs = {'content-type': 'application/x-www-form-urlencoded'};
    let params: {[index: string]:any} = {
      sessionId: this.sessionId,      
      title: item.title, 
      note: item.note,
      start: start.toLocaleDateString(),
      startTime: item.startTime,
      end: end.toLocaleDateString(),
      endTime: endTime,
      priority: null,
      addToCalendar: null,
      completed: completed,
      preserve: null,
      projectId: item.projectId,
      daysBack: 1,
      includeCompleted: true,
      getAll: false,
      onlyProject: 0,
      id: item.id
    };
    this.http.post<[DTPlanItem]>(url, '', {headers: hdrs, params: params}).subscribe( data => {
      let newPlanItems: Array<DTPlanItem> = [];      
      if (data) { for (let i=0; i < data.length; i++) { 
            newPlanItems = [...newPlanItems, data[i]];  }  }      
      this.dtPlanner.setPlanItems(newPlanItems);       
      this.planItems = this.dtPlanner.PlanItems();
    });       
  }

  addPlanItem(): void {

    if (!(this.newPlanItemTitle.length >0)) return;
    this.newPlanItemStart = this.newPlanItemStartDate.toString();
    this.newPlanItemEnd = new Date(this.newPlanItemEndDate).toString();

    let url = dtConstants.apiTarget + dtConstants.setPlanItemEndPoint;
    let hdrs = {'content-type': 'application/x-www-form-urlencoded'};
    let params: {[index: string]:any} = {
      sessionId: this.sessionId, 
      title: this.newPlanItemTitle, 
      note: this.newPlanItemNote,
      start: this.newPlanItemStart,
      startTime: this.newPlanItemStartTime,
      end: this.newPlanItemEnd,
      endTime: this.newPlanItemEndTime,
      priority: this.newPlanItemPriority,
      addToCalendar: null,
      completed: null,
      preserve: null,
      projectId: this.newPlanItemProjectId
    };
    this.http.post<[DTPlanItem]>(url, '', {headers: hdrs, params: params}).subscribe( data => {
      let newPlanItems: Array<DTPlanItem> = [];      
      if (data) { for (let i=0; i < data.length; i++) { 
            newPlanItems = [...newPlanItems, data[i]];  }  }      
      this.dtPlanner.setPlanItems(newPlanItems);       
      this.planItems = this.dtPlanner.PlanItems();;
    });        
  }

  itemStatus(item: DTPlanItem): string {
    if (item.completed == true) return "LightGreen";
    let now = new Date();
    let test = new Date(item.start as Date);
    if (test < now) return "LightPink";
    return "White";
  }  

  addProject(): void {
    if (!(this.newProjectTitle.length > 0 && this.newProjectShortCode.length > 0 && this.newProjectStatusId > 0)) return;

    let url = dtConstants.apiTarget + dtConstants.setProjectEndpoint;
    let hdrs = {'content-type': 'application/x-www-form-urlencoded'};
    let params: {[index: string]:any} = {
      sessionId: this.sessionId, 
      title: this.newProjectTitle, 
      shortCode: this.newProjectShortCode, 
      status: this.newProjectStatusId,
      colorCode: null,
      priority: this.newProjectPriority,
      sortOrder: null,
      notes: this.newProjectNotes
    };

    if (this.newProjectSortOrder != null) params["sortOrder"]
    if (this.newProjectColorCodeId > 0) { params["colorCode"] = this.newProjectColorCodeId; }    
    if (!(Number.isNaN(this.newProjectSortOrder))) { params["sortOrder"] = this.newProjectSortOrder; }

    this.http.post<[DTProject]>(url, '', {headers: hdrs, params: params}).subscribe( data => {
          let newProjects: Array<DTProject> = [];
      if (data) { for (let i=0; i < data.length; i++) {  newProjects = [...newProjects, data[i]];  }  }
      this.dtPlanner.setProjects(newProjects);
      this.projects = DtProjects;
    });    
    this.newProjectTitle = '';
    this.newProjectShortCode = '';
    this.newProjectStatusId = 1; 
    this.newProjectColorCodeId = 0;
    this.newProjectSortOrder = null;
    this.newProjectNotes = "";
  }
}
  
