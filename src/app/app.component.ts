import { Component, ViewChildren, ViewChild, ElementRef, QueryList, IterableDiffers } from '@angular/core';
import { DtAuthService } from './dt-auth.service';
import { CookieService } from 'ngx-cookie-service';
import {dtConstants, DTLogin, DTPlanItem, DTProject, DTUser, DTStatus, DTColorCode, DTRecurrance } from './dt-constants.service';
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
  recurrances: Array<DTRecurrance> = this.dtPlanner.Recurrances();
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
  newPlanItemIsRecurrance: boolean | null = false;
  newPlanItemRecurranceId: number | null = 0;
  newPlanItemRecurranceData: string | null = "";

  updateStatus: string = "";

  //Recurrance parameters
  recurranceSunday: boolean | null = null;
  recurranceMonday: boolean | null = null;
  recurranceTuesday: boolean | null = null;
  recurranceWednesday: boolean | null = null;
  recurranceThursday: boolean | null = null;
  recurranceFriday: boolean | null = null;
  recurranceSaturday: boolean | null = null;
  
  constructor(private readonly dtAuth: DtAuthService,
              private readonly cookies: CookieService,
              private http: HttpClient,
              private dtPlanner: DtPlannerService,
              private route: ActivatedRoute,
              private datePipe: DatePipe
              ) {
      this.loginInfo = { session: "", email: "", fName: "", lName: "", message: ""}; 
      this.newPlanItemStart = moment().format("MM/DD/YYYY");
      this.cookies.delete("loginInProgress");
    } 
    
  notMobile(): boolean {    
    let check = true;    
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = false;})(navigator.userAgent||navigator.vendor);    
    return check;  
  };

  isLoggedIn(): boolean {
    if (!this.loginComplete ){
      this.sessionId = this.cookies.get(dtConstants.dtSessionKey);
      this.cookies.delete(dtConstants.dtPlannerServiceStatusKey);
      let code = this.route.snapshot.queryParamMap.get('code');
      let flag = this.cookies.get("sentToGoogle");
      let logginInProgress = this.cookies.get("loginInProgress");      
      if (flag.length==0 && (logginInProgress == null || logginInProgress.length==0) && this.sessionId != null && this.sessionId.length > 0 && (code == null || code?.length == 0)) {
        this.cookies.set("loginInProgress", "true");
        let url = dtConstants.apiTarget + dtConstants.loginEndpoint + "?sessionId=" + this.sessionId;
        let res = this.http.get<DTLogin>(url).subscribe(data => {
          this.cookies.delete("loginInProgress");
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
            this.recurrances = this.dtPlanner.Recurrances();
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
    let returnValue = ("0" + (theDate.getDate() +1)).slice(-2) + "-" + ("0" + theDate.getDate()).slice(-2);
    if (this.notMobile()) {
      returnValue = theDate.toLocaleDateString(undefined, {weekday: 'short'}) + " " + 
        ("0" + (theDate.getMonth() +1)).slice(-2) + "-" + 
        ("0" + theDate.getDate()).slice(-2) + "-" +
        theDate.getFullYear();
    }
    return returnValue;
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
    console.log(this.newPlanItemIsRecurrance);
    console.log(this.newPlanItemRecurranceId);     
  }

  planItemParams(itemId: number): {[index: string]: any} {
    let item = (this.planItems.find(x => x.id == itemId) as DTPlanItem);
    let start = new Date(item.start);
    start.setDate(start.getDate()); 
    let end = new Date(start.toLocaleDateString());
    end.setHours(start.getHours() + item.duration.hours);
    end.setMinutes(start.getMinutes() + item.duration.minutes);
    let endTime = end.getHours().toString().padStart(2, "0")  + ":" + end.getMinutes().toString().padStart(2, "0");
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
      completed: item.completed,
      preserve: null,
      projectId: item.projectId,
      daysBack: 1,
      includeCompleted: true,
      getAll: false,
      onlyProject: 0,
      id: item.id
    };
    return params;
  }
  
  trackProjectsItem (index: number, project: DTProject): number {
    return project.id;
  }

  movePlanItemToNextDay(itemId: number) {
    let params = this.planItemParams(itemId);
    let hdrs = {'content-type': 'application/x-www-form-urlencoded'};
    let start = new Date(params["start"]);
    start.setDate(start.getDate() + 1);
    let end = new Date(params["end"]);
    end.setDate(end.getDate() + 1);
    params["start"] = start.toLocaleDateString();
    params["end"] = end.toLocaleDateString();
    let url = dtConstants.apiTarget + dtConstants.setPlanItemEndPoint;
    this.http.post<[DTPlanItem]>(url, '', {headers: hdrs, params: params}).subscribe( data => {
      let newPlanItems: Array<DTPlanItem> = [];      
      if (data) { for (let i=0; i < data.length; i++) { 
            newPlanItems = [...newPlanItems, data[i]];  }  }      
      this.dtPlanner.setPlanItems(newPlanItems);       
      this.planItems = this.dtPlanner.PlanItems();
    });       
  }

  deletePlanItem(itemId: number) {
    let item = (this.planItems.find(x => x.id == itemId) as DTPlanItem);
    let proceed = confirm('Delete ' + item.title + "?");
    if (proceed) {
      let hdrs = {'content-type': 'application/x-www-form-urlencoded'};
      let params: {[index: string]:any} = {
        sessionId: this.sessionId,
        planItemId: item.id
      }      
      let url = dtConstants.apiTarget + dtConstants.deletePlanItemEndPoint;
      this.http.post<[DTPlanItem]>(url, '', {headers: hdrs, params: params}).subscribe( data => {
        url = dtConstants.apiTarget + dtConstants.planItemsEndpoint + "?sessionId=" + this.sessionId + "&includeCompleted=true";
        this.http.get<[DTPlanItem]>(url, {headers: {'Content-Type':'text/plain'}}).subscribe( data => {
          this.dtPlanner.setPlanItems(data);
          this.planItems = this.dtPlanner.PlanItems();
        });
      }); 
    }   
  }

  setRecurranceFilter(event: any): void {
    let filter = "";
    if (!(this.recurranceSunday && 
        this.recurranceMonday &&
        this.recurranceTuesday &&
        this.recurranceWednesday &&
        this.recurranceThursday &&
        this.recurranceFriday &&
        this.recurranceSaturday) &&
        (this.recurranceSunday ||
         this.recurranceMonday ||
         this.recurranceTuesday ||
         this.recurranceWednesday ||
         this.recurranceThursday ||
         this.recurranceFriday ||
         this.recurranceSaturday)
      ) {
      filter = filter + (this.recurranceSunday ? "*" : "-");
      filter = filter + (this.recurranceMonday ? "*" : "-");      
      filter = filter + (this.recurranceTuesday ? "*" : "-");      
      filter = filter + (this.recurranceWednesday ? "*" : "-");      
      filter = filter + (this.recurranceThursday ? "*" : "-");      
      filter = filter + (this.recurranceFriday ? "*" : "-");      
      filter = filter + (this.recurranceSaturday ? "*" : "-");
    }
    this.newPlanItemRecurranceData = filter;
  }

  toggleIsRecurrance(event: any): void {
    this.newPlanItemIsRecurrance = event.srcElement.checked;
    if (this.newPlanItemIsRecurrance === true) this.newPlanItemRecurranceId = 1;
  }

  togglePlanItemCompleted(itemId: number, event: any): void {
    let completed = event.srcElement.checked;
    let params = this.planItemParams(itemId);
    params["completed"] = completed;
    let url = dtConstants.apiTarget + dtConstants.setPlanItemEndPoint;
    let hdrs = {'content-type': 'application/x-www-form-urlencoded'};
    this.http.post<[DTPlanItem]>(url, '', {headers: hdrs, params: params}).subscribe( data => {
      let newPlanItems: Array<DTPlanItem> = [];      
      if (data) { for (let i=0; i < data.length; i++) { 
            newPlanItems = [...newPlanItems, data[i]];  }  }      
      this.dtPlanner.setPlanItems(newPlanItems);       
      this.planItems = this.dtPlanner.PlanItems();
    });       
  }

  addPlanItem(): void {
    this.updateStatus = "Update underway.";
    if (!(this.newPlanItemTitle.length >0)) return;
    this.newPlanItemStart = this.newPlanItemStartDate.toString();
    if (this.newPlanItemEndDate >= this.newPlanItemStartDate) {
      this.newPlanItemEnd = this.newPlanItemEndDate.toString();
    } else {
      this.newPlanItemEnd = this.newPlanItemStart;
    }    

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
      projectId: this.newPlanItemProjectId,
      includeCompleted: true
    }
    if (this.newPlanItemIsRecurrance && (this.newPlanItemRecurranceId as number) > 0) {
      params['recurrance'] = this.newPlanItemRecurranceId as number;
      if ((this.newPlanItemRecurranceData as string).length > 0) {
        params['recurranceData'] = this.newPlanItemRecurranceData;
      }
    }
  
    this.http.post<[DTPlanItem]>(url, '', {headers: hdrs, params: params}).subscribe( data => {
      let newPlanItems: Array<DTPlanItem> = [];      
      if (data) { for (let i=0; i < data.length; i++) { 
            newPlanItems = [...newPlanItems, data[i]];  }  }      
      this.dtPlanner.setPlanItems(newPlanItems);       
      this.planItems = this.dtPlanner.PlanItems();
      this.updateStatus="Update complete";
    });        
  } 
  
  clearUpdateStatus(): void {
    this.updateStatus = "";
  }

  itemStatus(item: DTPlanItem): string {
    let now = new Date();
    let start = new Date(item.start as Date);
    let end =  new Date(item.start as Date)
    end.setHours(start.getHours() + item.duration.hours);
    end.setMinutes(start.getMinutes() + item.duration.minutes);

    let nowDate = now.toLocaleDateString();
    let nowTime = now.toLocaleTimeString();
    let startDate = start.toLocaleDateString();
    let startTime = start.toLocaleTimeString();
    let endDate = end.toLocaleDateString();
    let endTime = end.toLocaleTimeString();

    let statusColor = "LightGray";
    if (startDate == nowDate) statusColor = "LightGoldenrodYellow"    
    if (startDate == nowDate && start < now) statusColor = "Khaki";
    if (endDate == nowDate  && end < now) statusColor = "LightPink";
    if (startDate < nowDate) statusColor = "Pink";
    if (item.completed == true) statusColor ="LightGreen";
    if (statusColor == "LightPink") console.log (item.title, end, now);
    return statusColor;
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
  
