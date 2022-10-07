import { Component, OnInit, ViewChildren, ViewChild, ElementRef, QueryList, IterableDiffers } from '@angular/core';
import { DtAuthService } from './services/dt-auth.service';
import { CookieService } from 'ngx-cookie-service';
import { dtConstants, DTLogin, DTPlanItem, DTProject, DTUser, DTStatus, DTColorCode, DTRecurrence } from './services/dt-constants.service';
import { HttpClient } from '@angular/common/http';
import { DtPlannerService} from './services/dt-planner.service';
import { ActivatedRoute, TitleStrategy } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { DtData } from './services/dt-data-store.service';

const sessionId = "";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})

export class AppComponent implements OnInit {

  title = 'DanTech';
  sessionId = "";
  loginComplete = false;

  loginInfo: DTLogin;
  plannerInitializedFlag: boolean = !(this.cookies.check(dtConstants.dtPlannerServiceStatusKey));
  showRecurrences: boolean = false;
  
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
  newPlanItemNote: string | null = null;
  newPlanItemStart: string | null = moment().format("MM/DD/YYYY");
  newPlanItemStartDate: Date = new Date();
  newPlanItemStartTime: string | null = null;
  newPlanItemEnd: string | null = "";
  newPlanItemEndDate: Date = new Date();
  newPlanItemEndTime: string | null = null;
  newPlanItemPriority: number | null = null;
  newPlanItemAddToCalendar: boolean | null = null;
  newPlanItemProjectId: number | null = null;
  newPlanItemIsRecurrence: boolean | null = false;
  newPlanItemRecurrenceId: number | null = 0;
  newPlanItemRecurrenceData: string | null = "";

  //Recurrence parameters
  recurrenceSunday: boolean | null = null;
  recurrenceMonday: boolean | null = null;
  recurrenceTuesday: boolean | null = null;
  recurrenceWednesday: boolean | null = null;
  recurrenceThursday: boolean | null = null;
  recurrenceFriday: boolean | null = null;
  recurrenceSaturday: boolean | null = null;
  recurrenceNumberWeeks: number | null = null;
  
  showPrivacyPolicy: boolean = false;
  showToS: boolean = false;

  constructor(private readonly dtAuth: DtAuthService,
    private readonly cookies: CookieService,
    public dtPlanner: DtPlannerService,
    public data: DtData
  ) {
    this.loginInfo = { session: "", email: "", fName: "", lName: "", message: "" };
    this.newPlanItemStart = moment().format("MM/DD/YYYY");
    this.cookies.delete("loginInProgress");
    this.data.test = "Test set";
  }

  ngOnInit(): void {
    this.dtPlanner.componentMethodCalled$.subscribe((msg) => {
      this.processPlannerServiceResult(msg);
    });
  }

  addPlanItem(): void {
    this.data.updateStatus = "Update underway.";
    if (!(this.newPlanItemTitle.length > 0)) return;
    this.newPlanItemStart = this.newPlanItemStartDate.toString();
    if (this.newPlanItemEndDate >= this.newPlanItemStartDate) {
      this.newPlanItemEnd = this.newPlanItemEndDate.toString();
    } else {
      this.newPlanItemEnd = this.newPlanItemStart;
    }
    let params: { [index: string]: any } = {
      sessionId: this.data.sessionId,
      title: this.newPlanItemTitle,
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
    if (this.newPlanItemNote) params['note'] = this.newPlanItemNote;
    if (this.newPlanItemIsRecurrence && (this.newPlanItemRecurrenceId as number) > 0) {
      params['recurrence'] = this.newPlanItemRecurrenceId as number;
      if ((this.newPlanItemRecurrenceData as string).length > 0) {
        params['recurrenceData'] = this.newPlanItemRecurrenceData;
      }
    }

    this.dtPlanner.addPlanItem(params);
  }

  addProject(): void {
    if (!(this.newProjectTitle.length > 0 && this.newProjectShortCode.length > 0 && this.newProjectStatusId > 0)) return;

    let params: { [index: string]: any } = {
      sessionId: this.data.sessionId,
      title: this.newProjectTitle,
      shortCode: this.newProjectShortCode,
      status: this.newProjectStatusId,
      colorCode: null,
      priority: this.newProjectPriority,
      sortOrder: null,
      notes: this.newProjectNotes
    };

    if (this.newProjectSortOrder != null) params["sortOrder"] = this.newProjectSortOrder;
    if (this.newProjectColorCodeId > 0) { params["colorCode"] = this.newProjectColorCodeId; }
    if (!(Number.isNaN(this.newProjectSortOrder))) { params["sortOrder"] = this.newProjectSortOrder; }
    this.dtPlanner.addProject(params);
  }

  changePlanItemProject(itemId: number, event: any): void {
    let itm = this.getPlanItemOrRecurrenceItem(itemId);
    if (itm != undefined && Number(this.data.editValueFirst) != itm.projectId) {
      let params = this.planItemParams(itm.id);
      params["projectId"] = Number(this.data.editValueFirst);
      this.dtPlanner.updatePlanItem(params);
    }
  }

  changePlanItemTitle(itemId: number, event: any): void {
    this.data.updateStatus = "Updating item";
    let itm = this.getPlanItemOrRecurrenceItem(itemId);
    if (itm != undefined && (itm.title != this.data.editValueFirst || itm.note != this.data.editValueSecond)) {
      let params = this.planItemParams(itm.id);
      params["title"] = this.data.editValueFirst;
      params["note"] = (this.data.editValueSecond == null || this.data.editValueSecond == 'null') ? null : this.data.editValueSecond;
      this.dtPlanner.updatePlanItem(params);
    }
  }

  clearUpdateStatus(): void {
    this.data.updateStatus = "";
  }
 
  dayOfWeek(date: any): string {
    let theDate = new Date(date);
    let returnValue = ("0" + (theDate.getMonth() + 1)).slice(-2) + "-" + ("0" + theDate.getDate()).slice(-2);
    if (this.notMobile()) {
      returnValue = this.fullDate(date);
    }
    return returnValue;
  }

  deletePlanItem(itemId: number) {
    this.data.updateStatus = "Deleting...";
    let item = (this.dtPlanner.planItems.find(x => x.id == itemId) as DTPlanItem);
    let proceed = confirm('Delete ' + item.title + "?");
    if (proceed) {
      this.dtPlanner.deletePlanItem(item);
    }
  }

  dtAuthTest(): string {
    return "";
  }

  editItemEnd(event: any): void {
    if (event['key'] === 'Enter') {
      let itm = this.dtPlanner.planItems.find(x => x.id == this.data.itemBeingEdited);
      if (itm != undefined) {
        let params = this.planItemParams(itm.id);
        let numHrs = Number(this.data.editValueFirst);
        let numMins = Number(this.data.editValueSecond);
        let newStartTime = String(this.data.editValueFirst).padStart(2, '0') + ":" + String(this.data.editValueSecond).padStart(2, '0');
        if (newStartTime != params['startTime']) {
          numMins = numMins + itm.duration.minutes;
          numHrs = numHrs + itm.duration.hours;
          if (numMins >= 60) {
            numHrs = numHrs + 1;
            numMins = numMins - 60;
          }
          let newEndTime = String(numHrs).padStart(2, '0') + ":" + String(numMins).padStart(2,'0');                
          params['startTime'] = newStartTime;
          params['endTime'] = newEndTime;
          this.dtPlanner.updatePlanItem(params);
        }
        this.data.itemBeingEdited = 0;        
        this.data.fieldBeingEdited = "";
      }          
    } 
  }
  
  editItemStart(itemId: number | undefined, field: string): void {
    if (itemId == undefined) return;
    let itm = this.dtPlanner.planItems.find(x => x.id == itemId);
    let proj = undefined;
    if (itm == undefined) itm = this.dtPlanner.recurrenceItems.find(x => x.id == itemId);
    if (field == 'project-description') proj = this.dtPlanner.projects.find(x => x.id == itemId);
    if (itm == undefined) {
      this.data.itemBeingEdited = 0;
      this.data.fieldBeingEdited = '';
    }
    this.data.itemBeingEdited = (itemId as number);
    this.data.fieldBeingEdited = field;
    if (field == 'start') {
      this.data.editValueFirst = ((itm as DTPlanItem).startTime as string).split(':')[0];
      this.data.editValueSecond = ((itm as DTPlanItem).startTime as string).split(':')[1];
    }
    if (field == 'project') {
      this.data.editValueFirst = ((itm as DTPlanItem).projectId as number).toString();
    }
    if (field == 'title') {
      if (itm != undefined) {
        this.data.editValueFirst = itm.title;
        this.data.editValueSecond = itm.note == null || itm.note == 'null' ? "" : itm.note;
      }
    }
    if (field == 'project-description') {
      if (proj != undefined) {
        this.data.itemBeingEdited = itemId;
        this.data.fieldBeingEdited = 'project-description';
        this.data.editValueFirst = proj.title;
        this.data.editValueSecond = proj.notes;
        this.data.editValueThird = (proj.colorCodeId as number).toString();
      }
    }
  }

  emailChanged(): void {
    this.dtPlanner.setSession(this.loginInfo.session);
  }

  fullDate(date: any): string {
    let theDate = new Date(date);
    return theDate.toLocaleDateString(undefined, { weekday: 'short' }) + " " +
      ("0" + (theDate.getMonth() + 1)).slice(-2) + "-" +
      ("0" + theDate.getDate()).slice(-2) + "-" +
      theDate.getFullYear();
  }

  getLogin(): DTLogin | undefined {
    return this.loginInfo
  }

  getPlanItemOrRecurrenceItem(itemId: number): DTPlanItem | undefined {
    let itm = this.dtPlanner.planItems.find(x => x.id == itemId);
    if (itm == undefined) itm = this.dtPlanner.recurrenceItems.find(x => x.id == itemId);
    return itm;
  }

  hasProjects(): boolean {
    if (this.dtPlanner.projects && this.dtPlanner.projects.length > 0) return true;
    return false;
  }

  itemStatus(item: DTPlanItem): string {
    let now = new Date();
    let start = new Date(item.start as Date);
    let end = new Date(item.start as Date)
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
    if (endDate == nowDate && end < now) statusColor = "LightPink";
    if (new Date(startDate) < new Date(nowDate)) statusColor = "Pink";
    if (item.completed == true) statusColor = "DarkSeaGreen";
    return statusColor;
  }

  login(): void {
    return this.dtAuth.authenticate();
  }

  movePlanItemToNextDay(itemId: number) {
    this.data.updateStatus = "Updating item";
    let params = this.planItemParams(itemId);
    let start = new Date(params["start"]);
    start.setDate(start.getDate() + 1);
    let end = new Date(params["end"]);
    end.setDate(end.getDate() + 1);
    params["start"] = start.toLocaleDateString();
    params["end"] = end.toLocaleDateString();
    this.dtPlanner.updatePlanItem(params);
  }

  notMobile(): boolean {
    let check = true;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = false; })(navigator.userAgent || navigator.vendor);
    return check;
  };

  planItemDateChanged(date: any): boolean {
    let thisDate = this.dayOfWeek(date);
    let changed = false;
    if (thisDate != this.data.currentPlanItemDate) {
      changed = true;
      this.data.currentPlanItemDate = thisDate;
    }
    return changed;
  }

  planItemParams(itemId: number): { [index: string]: any } {
    let item = this.dtPlanner.planItems.find(x => x.id == itemId) as DTPlanItem;
    if (item == undefined) item = this.dtPlanner.recurrenceItems.find(x => x.id == itemId) as DTPlanItem;
    let start = new Date(item.start);
    start.setDate(start.getDate());
    let end = new Date(start.toLocaleDateString());
    end.setHours(start.getHours() + item.duration.hours);
    end.setMinutes(start.getMinutes() + item.duration.minutes);
    let endTime = end.getHours().toString().padStart(2, "0") + ":" + end.getMinutes().toString().padStart(2, "0");
    let params: { [index: string]: any } = {
      sessionId: this.data.sessionId,
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
      id: item.id,
      recurrence: item.recurrence,
      recurrenceData: item.recurrenceData
    };
      
    return params;
  }

  processPlannerServiceResult(msg: string): void {
    this.plannerInitializedFlag = !(this.cookies.check(dtConstants.dtPlannerServiceStatusKey));
    this.data.firstPlanItemId = (this.dtPlanner.planItems.find(x => x.recurrence == undefined || x.recurrence < 1) as DTPlanItem).id;  
    this.data.updateStatus = "";
    this.data.itemBeingEdited = 0; 
    this.newPlanItemRecurrenceData = ""; 
    this.newProjectTitle = '';
    this.newProjectShortCode = '';
    this.newProjectStatusId = 1;
    this.newProjectColorCodeId = 0;
    this.newProjectSortOrder = null;
    this.newProjectNotes = "";
    this.data.fieldBeingEdited = "";
    this.data.editValueFirst = "";
    this.data.editValueSecond = "";
    this.data.editValueThird = "";
    this.loginInfo = this.data.login as DTLogin;
    if (this.data.targetProject != undefined) {
      let updatedProject  = this.dtPlanner.projects.find(x => x.id == (this.data.targetProject as DTProject).id);
      if (updatedProject?.colorCodeId != this.data.targetProject.colorCodeId ||
          updatedProject?.title != this.data.targetProject.title ||
          updatedProject?.notes != this.data.targetProject.notes
        ) {
          this.data.targetProject = updatedProject;
          console.log ("calling update.");
          this.dtPlanner.update();
        } 
      this.data.projectItems = this.dtPlanner.projectItems;     
    }    
  }

  propagateRecurrence(itemId: number): void {
    this.data.updateStatus = "Updateing...";
    this.dtPlanner.propagateRecurrence(itemId);
  }

  setProjectDescription(event: any): void {
    let params: { [index: string]: any } = { sessionId: this.data.sessionId, 
                                             title: this.data.editValueFirst, 
                                             shortCode: this.data.targetProject?.shortCode, 
                                             colorCode: this.data.editValueThird, 
                                             status: 1,
                                             notes: "",
                                             id: this.data.targetProject?.id                                              
                                            }
    if (this.data.editValueSecond != null && this.data.editValueSecond != undefined && this.data.editValueSecond.length) {
      params["notes"] = this.data.editValueSecond;      
    }    
    this.dtPlanner.addProject(params);
    this.data.itemBeingEdited = 0;
    this.data.fieldBeingEdited = '';
    this.data.editValueFirst = '';
    this.data.editValueSecond = "";
    this.data.editValueThird = "";
  }

  setRecurrenceFilter(event: any): void {
    let filter = "";
    if (!(this.recurrenceSunday &&
      this.recurrenceMonday &&
      this.recurrenceTuesday &&
      this.recurrenceWednesday &&
      this.recurrenceThursday &&
      this.recurrenceFriday &&
      this.recurrenceSaturday) &&
      (this.recurrenceSunday ||
        this.recurrenceMonday ||
        this.recurrenceTuesday ||
        this.recurrenceWednesday ||
        this.recurrenceThursday ||
        this.recurrenceFriday ||
        this.recurrenceSaturday)
    ) {
      filter = filter + (this.recurrenceSunday ? "*" : "-");
      filter = filter + (this.recurrenceMonday ? "*" : "-");
      filter = filter + (this.recurrenceTuesday ? "*" : "-");
      filter = filter + (this.recurrenceWednesday ? "*" : "-");
      filter = filter + (this.recurrenceThursday ? "*" : "-");
      filter = filter + (this.recurrenceFriday ? "*" : "-");
      filter = filter + (this.recurrenceSaturday ? "*" : "-");
    }    
    this.newPlanItemRecurrenceData = filter;
    if (this.recurrenceNumberWeeks && 
        this.newPlanItemIsRecurrence && 
        (this.newPlanItemRecurrenceId == 3 ||
         this.newPlanItemRecurrenceId == 4)) this.newPlanItemRecurrenceData = this.recurrenceNumberWeeks.toString() + ":" + filter;    
  }

  showOrHideProject(projId: number): void {
    if (this.data.projectVisible) {
      this.data.projectVisible = false;
      this.data.targetProject = undefined;
      this.data.projectItems = [];
    } else {
      this.data.projectVisible = true;
      this.data.targetProject = this.dtPlanner.projects.find(x => x.id == projId);
      this.dtPlanner.loadProjectItems(projId);    
    }
  }

  test(): void {
    let itm = this.dtPlanner.planItems.find(x => x.title = 'Docs for Kathy');
    this.data.test = "Test value changed";
    console.log("Test fired.", itm);
  } 
  
  timeStamp(): string {
    return new Date().toLocaleString();
  }

  toggleIsRecurrence(event: any): void {
    this.newPlanItemIsRecurrence = event.srcElement.checked;
    if (this.newPlanItemIsRecurrence === true) this.newPlanItemRecurrenceId = 1;
  }

  togglePlanItemCompleted(itemId: number, event: any): void {
    this.data.updateStatus = "Updating item";
    let completed = event.srcElement.checked;
    let params = this.planItemParams(itemId);
    params["completed"] = completed;
    this.dtPlanner.updatePlanItem(params);
  }

  toggleShowRecurrences() : void {
    this.showRecurrences = !this.showRecurrences;
  }

  tooltipFormatted(s:string): string {
    let result = s.replaceAll("\n", "<br />\n");
    return result;
  }

  trackProjectsItem(index: number, project: DTProject): number {
    return project.id;
  }

  validEmail(): boolean {
    return this.loginInfo != undefined &&
      this.loginInfo.email != undefined &&
      this.loginInfo.email != "null" &&
      this.loginInfo.email != null &&
      this.loginInfo.email.length > 0;
  }
}

