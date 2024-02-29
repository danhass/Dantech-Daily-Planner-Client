import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { dtConstants, DTColorCode, DTLogin, DTPlanItem, DTProject, DTStatus, DTUser, DTRecurrence} from './dt-constants.service';
import { CookieService } from 'ngx-cookie-service';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { Time } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class DtPlannerService {
  public colorCodes: Array<DTColorCode> = [];
  private componentMethodCallSource = new Subject<any>();
  componentMethodCalled$ = this.componentMethodCallSource.asObservable();
  public firstPlanItemDate: string = '';
  public planItems: Array<DTPlanItem> = [];
  public projects: Array<DTProject> = [];
  public projectItems: Array<DTPlanItem> = [];
  public recurrenceItems: Array<DTPlanItem>=[];
  public recurrences: Array<DTRecurrence> = [];
  public sessionId: string = "";
  public stati: Array<DTStatus> = [];
  public updateStatus: string = '';

  constructor(
    private http: HttpClient,
    private cookie: CookieService
  ) {   
  }

  addPlanItem(params: { [index: string]: any }): void {
    let url = dtConstants.apiTarget + dtConstants.setPlanItemEndpoint;
    let hdrs = { 'content-type': 'application/x-www-form-urlencoded' };
    let body = "";
    if (params["note"]) {
      body = '{ note: ' + params['note'] + ' }';
      delete params["note"];
    }
    this.http.post<[DTPlanItem]>(url, body, { headers: hdrs, params: params }).subscribe(data => {
      this.update();
    });
  }
  
  addProject(params: { [index: string]: any }): void {
    let url = dtConstants.apiTarget + dtConstants.setProjectEndpoint;
    let hdrs = { 'content-type': 'application/x-www-form-urlencoded' };
    this.http.post<[DTProject]>(url, '', { headers: hdrs, params: params }).subscribe(data => {
      let newProjects: Array<DTProject> = [];
      if (data) { for (let i = 0; i < data.length; i++) { newProjects = [...newProjects, data[i]]; } }
      this.setProjects(newProjects);
      this.update();
    });
  }

  adjust(): void {
    let url = dtConstants.apiTarget + dtConstants.adjustEndpoint;
    let hdrs = { 'content-type': 'application/x-www-form-urlencoded' };
    let params: { [index: string]: any} = {};
    params["sessionId"] = this.sessionId;
    this.updateStatus = "Adjusting";
    this.http.post<any>(url, '', { headers: hdrs, params: params }).subscribe(data => {
      this.update();
    });  
  }

  reversPlanItems(): void {
    if (this.planItems.length > 0) {
      if (this.planItems[0].day > this.planItems[this.planItems.length - 1].day) {
        this.planItems = this.planItems.reverse();
      }
    }
  }

  changePlanItem(event: any, item: DTPlanItem | undefined, editValueFirst: string, editValueSecond: string, editValueThird: string): boolean {
    if (item == undefined) return true;
    let itm = (item as DTPlanItem);    
    if (event.srcElement.id == 'changeTitle') {
      let priority = +editValueThird;
      if (isNaN(priority)) priority = 0;
      if (itm != undefined && (itm.title != editValueFirst || itm.note != editValueSecond || itm.priority != priority)) {
        let params = this.planItemParamsFromItem(itm);
        params["title"] = editValueFirst;
        params["note"] = (editValueSecond == null || editValueSecond == 'null') ? null : editValueSecond;
        if (itm.priority != priority) params['priority'] = priority.toString();
        this.updatePlanItem(params);
      }
    }
    if (event.srcElement.id == 'changeStart') {
      if (itm != undefined && 
          ((itm.startTime as string).split(':')[0] != editValueFirst || 
            (itm.startTime as string).split(':')[1] != editValueSecond ||
            ((itm.fixedStart && !editValueThird) || (!itm.fixedStart && editValueThird)
          ))) {
        let params = this.planItemParamsFromItem(itm);
        let hr = +editValueFirst;       
        if (isNaN(hr)) hr = 0;             
        let mins = +editValueSecond;      
        if (isNaN(mins)) mins = 0;         
        let oldHr = +itm.startTime.split(':')[0];      
        if (isNaN(oldHr)) oldHr = 0;      
        let oldMin = +itm.startTime.split(':')[1];      
        if (isNaN(oldMin)) oldMin = 0;   
        let startDate = new Date(new Date(new Date(itm.day).setHours(hr)).setMinutes(mins));
        let endDate = new Date(startDate);
        if (itm.durationString.length > 0) {
          hr = +itm.durationString.split(':')[0];
          if (isNaN(hr)) hr = 0;             
          mins = +itm.durationString.split(':')[1];
          if (isNaN(mins)) mins = 0;
          endDate.setHours(endDate.getHours() + hr);
          endDate.setMinutes(endDate.getMinutes() + mins);         
        }   
        params['start'] = startDate.toLocaleDateString();
        params['startTime'] = (moment(startDate.toLocaleTimeString(), "h:mm:ss A").format("HH:mm"));
        params['end'] = endDate.toLocaleDateString();
        params['endTime'] = (moment(endDate.toLocaleTimeString(), "h:mm:ss A").format("HH:mm"));
        if (editValueThird) params['fixedStart'] = true;
        this.updatePlanItem(params);    
      }
    }
    if (event.srcElement.id == 'changeProject') {
      if (itm != undefined && (itm.project?.shortCode != editValueFirst)) {
        let proj = this.projects.find(x => x.shortCode == editValueFirst);
        if (proj) {          
          let params = this.planItemParamsFromItem(itm);
          params["projectId"] = proj.id;
          this.updatePlanItem(params);
        }
      }
    }
    if (event.srcElement.id == 'changeDay') {      
      let startDate = new Date(itm.start);      
      let newDate = new Date(editValueFirst);
      newDate = new Date(newDate.setDate(newDate.getDate() + 1));
      if (startDate.toLocaleDateString() != newDate.toLocaleDateString()) {
        let endDate = new Date(itm.start);
        let newStart = new Date(new Date(newDate.setHours(startDate.getHours())).setMinutes(startDate.getMinutes()));
        if (itm.durationString) {
          let Hr = +itm.durationString.split(':')[0];      
          if (isNaN(Hr)) Hr = 0;      
          let Mins = +itm.durationString.split(':')[1];      
          if (isNaN(Mins)) Mins = 0;      
          endDate = new Date(newStart.setHours(newDate.getHours() + Hr));
          endDate = new Date(endDate.setMinutes(endDate.getMinutes() + Mins));
        }
        let params = this.planItemParamsFromItem(itm);
        params['startTime'] = moment(newStart.toLocaleTimeString(), "h:mm:ss A").format("HH:mm");   
        params['start'] = newStart.toLocaleDateString();  
        params['endTime'] = moment(endDate.toLocaleTimeString(), "h:mm:ss A").format("HH:mm");      
        params['end'] = endDate.toLocaleDateString();  
        this.updatePlanItem(params);
      }
    }
    return true;
  }

  changeProject(
    event: any, project: DTProject | undefined, 
    field: string, 
    editValueFirst: string,
    editValueSecond: string,
    editValueThird: string,
    editValueFourth: string)
    : boolean {
    let proj = (project as DTProject)
    if (field == 'project-shortCode' && proj.shortCode == editValueFirst) return true;
    if (field == 'project-description' && 
        proj.title == editValueFirst &&
        proj.notes == editValueSecond &&
        proj.colorCodeId?.toString() == editValueThird &&
        proj.priority?.toString() == editValueFourth
       ) return true;

    let params: { [index: string]: any } = {
      sessionId: this.sessionId,
      id: proj.id,
      title: proj.title,
      shortCode: proj.shortCode,
      status: proj.status,
      colorCode: proj.colorCodeId,
    };
    if (proj.priority && editValueFourth) params['priority'] = proj.priority.toString();
    if (proj.notes && proj.notes !== 'null' && !(field == 'project-description' && !editValueSecond)) params['notes'] = proj.notes;

    if (field == 'project-shortCode') params['shortCode'] = editValueFirst;

    if (field == 'project-description') {
      params['title'] = editValueFirst;
      if (editValueSecond || params['notes']) params['notes'] = editValueSecond
      params['colorCode'] = editValueThird;
      if (editValueFourth) params['priority'] = editValueFourth;
    }

    this.addProject(params);
    return true;
  }

  clearProject(): boolean {
    this.projectItems = [];
    this.pingComponents("Clear project");
    return true;
  }

  deletePlanItem(item: DTPlanItem | undefined): boolean {
    if (item === undefined) return false;
    let hdrs = { 'content-type': 'application/x-www-form-urlencoded' };    
    let params: { [index: string]: any } = {      
      sessionId: this.sessionId,      
      planItemId: item.id    
    }      
    let url = dtConstants.apiTarget + dtConstants.deletePlanItemEndpoint; 
    this.updateStatus = "Deleting...";
    this.http.post<[DTPlanItem]>(url, '', { headers: hdrs, params: params }).subscribe(data => {    
      url = dtConstants.apiTarget + dtConstants.planItemsEndpoint + "?sessionId=" + this.sessionId + "&includeCompleted=true";    
      this.http.get<[DTPlanItem]>(url, { headers: { 'Content-Type': 'text/plain' } }).subscribe(data => {   
        this.update();  
      });    
    });
    return true;    
  }

  deleteProject(projectId: number, deleteItems: boolean, transfer: number): void {
    let hdrs = { 'content-type': 'application/x-www-form-urlencoded' };    
    let params: { [index: string]: any } = {      
      sessionId: this.sessionId,      
      projectId: projectId,
      deleteProjectItems: deleteItems,
      transferProject: transfer
    }      
    let url = dtConstants.apiTarget + dtConstants.deleteProjectEndpoint;    
    this.http.post<[DTPlanItem]>(url, '', { headers: hdrs, params: params }).subscribe(data => {    
      this.update();
    });        
  }

  deleteRecurrence(item: DTPlanItem | undefined) {
    if (item == undefined) return;
    let delChildren = (confirm('Delete child items of ' + item.title + ', too?'));
    let proceed = confirm('Delete ' + item.title + "?");
    if (!proceed) return;
    this.updateStatus = "Deleting...";
    let hdrs = { 'content-type': 'application/x-www-form-urlencoded' };    
    let params: { [index: string]: any } = {      
      sessionId: this.sessionId,      
      planItemId: item?.id,
      deleteChildren: delChildren    
    }      
    let url = dtConstants.apiTarget + dtConstants.deletePlanItemEndpoint;    
    this.http.post<[DTPlanItem]>(url, '', { headers: hdrs, params: params }).subscribe(data => {    
      this.update();
    });        
  }

  editPlanItem(event: any, itemId: number | undefined, field: string, newVal1: string, newVal2: string): boolean {
    if (event['key'] !== 'Enter') return true;
    let itm = this.planItems.find(x => x.id == itemId);
    if (itm == undefined) itm = this.recurrenceItems.find(x => x.id == itemId);
    if (itm == undefined) itm = this.projectItems.find(x => x.id == itemId);
    if (itm == undefined || !field || (!newVal1 && !newVal2) ) return true;

    let doUpdate = false;
    let params = this.planItemParamsFromItem(itm);
 
    if (field == 'duration') {      
      let hr = +newVal1;       
      if (isNaN(hr)) hr = 0;             
      let mins = +newVal2;      
      if (isNaN(mins)) mins = 0;         
      let oldHr = +itm.durationString.split(':')[0];      
      if (isNaN(oldHr)) oldHr = 0;      
      let oldMin = +itm.durationString.split(':')[1];      
      if (isNaN(oldMin)) oldMin = 0;      
      if (hr == oldHr && mins == oldMin) return true;          
      doUpdate = true;      
      let startDate = new Date(itm.start);      
      let endDate = new Date(itm.start);                   
      if (!isNaN(hr)) endDate = new Date(endDate.setHours(endDate.getHours() + hr));           
      if (!isNaN(mins)) endDate = new Date(endDate.setMinutes(endDate.getMinutes() + mins));      
      params['startTime'] = moment(startDate.toLocaleTimeString(), "h:mm:ss A").format("HH:mm");      
      params['endTime'] = moment(endDate.toLocaleTimeString(), "h:mm:ss A").format("HH:mm");      
      params['end'] = endDate.toLocaleDateString();         
    }
    if (field == 'startTime') {
      let hr = +newVal1;       
      if (isNaN(hr)) hr = 0;             
      let mins = +newVal2;      
      if (isNaN(mins)) mins = 0;         
      let oldHr = +itm.startTime.split(':')[0];      
      if (isNaN(oldHr)) oldHr = 0;      
      let oldMin = +itm.startTime.split(':')[1];      
      if (isNaN(oldMin)) oldMin = 0;      
      if (hr == oldHr && mins == oldMin) return true;          
      doUpdate = true;
      let startDate = new Date(new Date(new Date(itm.day).setHours(hr)).setMinutes(mins));
      let endDate = new Date(startDate);
      if (itm.durationString.length > 0) {
        hr = +itm.durationString.split(':')[0];
        if (isNaN(hr)) hr = 0;             
        mins = +itm.durationString.split(':')[1];
        if (isNaN(mins)) mins = 0;
        endDate.setHours(endDate.getHours() + hr);
        endDate.setMinutes(endDate.getMinutes() + mins);         
      }   
      params['start'] = startDate.toLocaleDateString();
      params['startTime'] = (moment(startDate.toLocaleTimeString(), "h:mm:ss A").format("HH:mm"));
      params['end'] = endDate.toLocaleDateString();
      params['endTime'] = (moment(endDate.toLocaleTimeString(), "h:mm:ss A").format("HH:mm"));
    }
    if (doUpdate) {
      this.updateStatus = 'Updating...';
      this.updatePlanItem(params);
    }
    return true;
  }

  getColorCodes(): Array<DTColorCode>{
    return this.colorCodes;
  }

  getPlanItems(): Array<DTPlanItem>{
    return this.planItems;
  }

  getProjects(): Array<DTProject>{
    return this.projects;
  }

  getRecurrenceItems(): Array<DTPlanItem>{
    return this.recurrenceItems;
  }

  getRecurrences(): Array<DTRecurrence>{
    return this.recurrences;
  }  

  initialize(): void {
    this.cookie.set(dtConstants.dtPlannerServiceStatusKey, "initializing")
    this.updateStatus = 'Initializing...'
    let header = new HttpHeaders({'Content-Type':'text/plain'});
    let url = dtConstants.apiTarget + dtConstants.planColorCodeEndpoint; 
    this.http.get<[DTColorCode]>(url, {headers: header}).subscribe(data => {      
      this.colorCodes = [ {id: 0, title: "None", note: ""} ];      
      for (let i=0; i < data.length; i++){        
        this.colorCodes.push(data[i]);      
      }      
      url = dtConstants.apiTarget + dtConstants.planStatiEndpoint;
      this.http.get<[DTStatus]>(url, {headers: header}).subscribe(data => {        
        for (let i=0; i < data.length; i++){ 
          data[i].colorString="";
          let color = this.colorCodes.find(x => x.id == data[i].colorCode);
          if (color != undefined) { 
            data[i].color = color; 
            data[i].colorString = color.title;
          }                 
          this.stati.push(data[i]);        
        }
        url = dtConstants.apiTarget + dtConstants.recurrencesEndpoint + "?sessionId=" + this.sessionId;
        this.http.get<any>(url, {headers: header}).subscribe(data => { 
          this.recurrences = data;  
          this.updateStatus = "Populating...";
          url = dtConstants.apiTarget + dtConstants.populateEndpoint + "?sessionId=" + this.sessionId;
          this.http.get<any>(url, {headers: header}).subscribe(data => { 
            this.update();
          });       
        });
      });  
    }); 
  }

  isColorOnAtLeastOneProject(colorId: number): boolean {
    if (this.projects.find(x => x.colorCodeId == colorId)) return true;
    return false;
  }

  linkPlanItemsToProjects(items: Array<DTPlanItem>): void {
    let flag = this.cookie.get(dtConstants.dtPlannerServiceStatusKey);
    if (flag == null || flag.length == 0) {
      for (let i=0; i < items.length; i++) {
        items[i].project = this.projects.find( x => x.id == items[i].projectId);
        if (items[i].project) {
          items[i].projectId = items[i].project?.id;
          items[i].projectTitle = (items[i].project?.title as string);
          items[i].projectMnemonic = (items[i].project?.shortCode as string);
        }
      }
    }
  }

  loadProjectItems(projId: number): void {
    this.projectItems = [];
    let url = dtConstants.apiTarget + dtConstants.planItemsEndpoint + "?sessionId=" + this.sessionId + "&includeCompleted=true&getAll=true&onlyProject=" + projId;
    this.http.get<[DTPlanItem]>(url, {headers: {'Content-Type':'text/plain'}}).subscribe( data => {
      let items = this.setItems(data);
      this.projectItems = items;
      this.pingComponents("Project items loaded.");
    });
  }

  movePlanItemToNextDay(item: DTPlanItem | undefined) {
    this.firstPlanItemDate = this.planItems.sort((a, b) => a.dayString < b.dayString ? -1 : 1)[0].dayString;
    let itm = (item as DTPlanItem)
    this.updateStatus = "Updating...";
    let params = this.planItemParamsFromItem(itm);
    let start = new Date(params["start"]);
    start.setDate(start.getDate() + 1);
    let end = new Date(params["end"]);
    end.setDate(end.getDate() + 1);
    params["start"] = start.toLocaleDateString();
    params["end"] = end.toLocaleDateString();
    this.updatePlanItem(params);
  }

  pingComponents(msg: string){
    this.componentMethodCallSource.next(msg);
  }

  planItemIsPastDate(item: DTPlanItem): boolean {
    let now = new Date();
    if (item.dayString === now.toDateString()) { return false; }
    let itemDate = new Date(item.day);
    if (itemDate.getFullYear() < now.getFullYear() 
        || (itemDate.getFullYear() === now.getFullYear() && itemDate.getMonth() < now.getMonth())
        || (itemDate.getFullYear() === now.getFullYear() && itemDate.getMonth() === now.getMonth() && itemDate.getDate() < now.getDate())
       ) { 
          return true; 
    }
    return false;
  }
  
  planItemParams(itemId: number): { [index: string]: any } {
    let item = this.planItems.find(x => x.id == itemId) as DTPlanItem;
    if (item == undefined) item = this.recurrenceItems.find(x => x.id == itemId) as DTPlanItem;
    if (item == undefined) item = this.projectItems.find(x => x.id == itemId) as DTPlanItem;
    if (item == undefined) return [];
    return this.planItemParamsFromItem(item);
  }

  planItemParamsFromItem(item: DTPlanItem): { [index: string]: any } {
    if (item == undefined) return [];
    let start = new Date(item.start);
    start.setDate(start.getDate());
    let end = new Date(start.toLocaleDateString());
    end.setHours(start.getHours() + item.duration.hours);
    end.setMinutes(start.getMinutes() + item.duration.minutes);
    let endTime = end.getHours().toString().padStart(2, "0") + ":" + end.getMinutes().toString().padStart(2, "0");
    let params: { [index: string]: any } = {
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
      id: item.id,
      recurrence: item.recurrence,
      recurrenceData: item.recurrenceData
    };      
    return params;
  }

  propagateRecurrence(itemId: number): void {
    let itm = this.planItems.find(x => x.id == itemId);
    if (itm == undefined) itm = this.projectItems.find(x => x.id == itemId);
    if (itm != undefined) alert ("Proagating: " + itm.title);
    let url = dtConstants.apiTarget + dtConstants.propagateEndpoint + "?sessionId=" + this.sessionId + "&seedId=" + itemId;
    this.updateStatus = 'Propagating...';
    this.http.get<[boolean]>(url, {headers: {'Content-Type':'text/plain'}}).subscribe( data => {    
      if (data) {
        this.update();
      } else {
        this.updateStatus = '';
      }
    });
  }

  setItems (data: Array<DTPlanItem>): Array<DTPlanItem> {
    let items: Array<DTPlanItem> = [];
    if (data) {
      data = data.sort((a, b) => a.dayString < b.dayString ? -1 : 1);
      for (let i=0; i< data.length; i++) {
        items.push(data[i]); 
        items[i].project = this.projects.find( x => x.id == items[i].projectId);
        if (items[i].project) {
          items[i].projectTitle = (items[i].project?.title as string);
          items[i].projectId = (items[i].project?.id as number);
          items[i].projectMnemonic = (items[i].project?.shortCode as string);
        }
      }
      for (let i=0; i< items.length; i++) { 
        if (items[i].fixedStart == null) items[i].fixedStart = false;
        let dateBuffer = new Date(items[i].start as Date);  
        items[i].startTime = dateBuffer.getHours().toString().padStart(2, "0")  + ":" + dateBuffer.getMinutes().toString().padStart(2, "0");
        items[i].startHour = dateBuffer.getHours().toString().padStart(2, "0");
        items[i].startMinutes = dateBuffer.getMinutes().toString().padStart(2, "0");
        items[i].dayString = dateBuffer.toDateString();
        items[i].durationString = items[i].duration.toString();
/*        items[i].durationString = (items[i].duration.hours > 0 || items[i].duration.minutes > 0) ?
          items[i].duration.hours.toString().padStart(2, "0") + ":" + 
          items[i].duration.minutes.toString().padStart(2,"0") : ""; */
        items[i].durationHour = items[i].durationString.length > 0 ? items[i].durationString.split(':')[0]: '00';
        items[i].durationMinutes = (items[i].durationString.length > 0 && items[i].durationString.split(':').length > 0) ? items[i].durationString.split(':')[1] : '00'
      }
      for (let i=0; i< items.length; i++) {
        if (items[i].recurrence != undefined && items[i].recurrence != null) {
          items[i].recurrenceName = this.recurrences.find(x => x.id == items[i].recurrence)?.title;
        }        
      }
    }
    return items;
  }

  setPlanItems(data: Array<DTPlanItem>): void {
    if (data) {
      this.planItems = this.setItems(data); 
      this.linkPlanItemsToProjects(this.planItems);
    }
  }

  setRecurrenceItems(data: Array<DTPlanItem>): void {
    if (data) {
      this.recurrenceItems = this.setItems(data);
      this.recurrenceItems = this.recurrenceItems.sort((a,b) =>  a.startTime < b.startTime ? -1 : 1);
      this.linkPlanItemsToProjects(this.recurrenceItems);
    }
  }

  setProjects(data: Array<DTProject>): void {
    if (data) { 
      this.projects = [];
      for (let i=0; i < data.length; i++) {
        data[i].colorString = "White";
        if (data[i].colorCodeId != undefined && (data[i].colorCodeId as number) > 0 && this.colorCodes.length > 0) {
          let color = this.colorCodes.find(x => x.id == data[i].colorCodeId);
          if (color != undefined) {
            data[i].colorString = (color as DTColorCode).title;
            data[i].color = color;
          }
        }
        let obj = this.stati.find(x => x.id == data[i].status);
        data[i].statusObj = (obj as DTStatus);
        this.projects.push(data[i]); 
      }
      this.projects = this.projects.sort((a, b) => a.title < b.title ? -1 : 1);  
    }
  }

  setSession(newSession: string): void {
    this.sessionId = newSession;
  }

  togglePlanItemCompleted(item: DTPlanItem | undefined, event: any): void {
    let itm = (item as DTPlanItem);
    this.updateStatus = "Updating...";
    let completed = (event && event.srcElement && event.srcElement.checked);
    let params = this.planItemParamsFromItem(itm);
    params["completed"] = completed;
    this.updatePlanItem(params);
  }

  update(): void {
    this.updateStatus = 'Items...';
    let url = dtConstants.apiTarget + dtConstants.planItemsEndpoint + "?sessionId=" + this.sessionId + "&includeCompleted=true";
    this.http.get<[DTPlanItem]>(url, {headers: {'Content-Type':'text/plain'}}).subscribe( data => {
      this.setPlanItems(data); 
      this.updateStatus = 'Recurrences';
      url = dtConstants.apiTarget + dtConstants.planItemsEndpoint + "?sessionId=" + this.sessionId + "&includeCompleted=true&getAll=true&onlyRecurrences=true";
      this.http.get<[DTPlanItem]>(url, {headers: {'Content-Type':'text/plain'}}).subscribe( data => {
        this.setRecurrenceItems(data);  
        let projId = this.projectItems.length > 0 ? (this.projectItems[0].projectId as number) : 0;          
        url = dtConstants.apiTarget + dtConstants.projectsEndpoint + "?sessionId=" + this.sessionId; 
        //this.updateStatus = 'Projects';       
        this.http.get<[DTProject]>(url, {headers: {'Content-Type':'text/plain'}}).subscribe(data => {          
          this.projects = [];          
          this.setProjects(data);
          this.cookie.delete(dtConstants.dtPlannerServiceStatusKey);                      
          this.linkPlanItemsToProjects(this.planItems);                      
          this.linkPlanItemsToProjects(this.recurrenceItems);                 
          this.updateStatus = '';                               
          if (this.projectItems.length > 0) {
            this.projectItems = this.recurrenceItems.filter(x => x.project != undefined && x.project.id == projId);
            this.projectItems = this.projectItems.concat(this.planItems.filter(x => x.project != undefined && x.project.id == projId && !x.recurrence));
            this.cookie.delete(dtConstants.dtPlannerServiceStatusKey);
          }
          for(let i = 0; i<this.projectItems.length; i++) this.projectItems[i].projectMnemonic = (this.projectItems[i].project?.shortCode as string);
          this.firstPlanItemDate = new Date().toDateString(); 
          this.pingComponents("dtPlanner update complete");          
        });
      });           
    });  
  }

  updateFromItem(item: DTPlanItem): boolean {
    if (!item.touched) return true;
    if (item.projectMnemonic) {
      item.project = this.projects.find(x => x.shortCode == item.projectMnemonic);
      if (item.project) item.projectId = item.project.id;
    }
    let original = item.recurrence ? this.recurrenceItems.find(x => x.id == item.id) : this.planItems.find(x => x.id == item.id); 
    if (original == undefined) return true;
    item.startTime = item.startHour.toString().padStart(2, '0') + ':' + item.startMinutes.toString().padStart(2,'0');
    let start = new Date(item.start);
    let hr = +item.startHour;
    if (!isNaN(hr) && start.getHours() != hr) start.setHours(hr);
    let mins = +item.startMinutes;
    if (!isNaN(mins) && start.getMinutes() != mins) start.setMinutes(mins);
    item.start = start;    
    let dayBuf = new Date(item.day);
    if (dayBuf.toDateString() != (item.day + "") && (item.day + "").split('-').length > 2) {
      let mn = +(item.day + "").split('-')[1];
      let dy = +(item.day + "").split('-')[2];
      if (!isNaN(dy)) dayBuf.setDate(dy);
      if (!isNaN(mn)) dayBuf.setMonth(mn - 1);
    }
    if (dayBuf.toDateString() != item.start.toDateString()) {
      item.start = dayBuf;
    }
    hr = +item.durationHour;
    if (isNaN(hr)) hr = 0;
    mins = +item.durationMinutes;
    if (isNaN(mins)) mins = 0;
    if ((isNaN(hr) && isNaN(mins)) || (hr == 0 && mins == 0)) {
      item.durationString = '';
      item.duration = { hours: 0, minutes: 0 }
    } else {
      if (!isNaN(hr)) {
        item.durationString = hr.toString().padStart(2, '0');
        item.duration = { hours: hr, minutes: 0 }
      } else {
        item.durationString = '00';
        item.duration = { hours: 0, minutes: 0};
      }
      item.durationString = item.durationString + ':';
      if (!isNaN(mins)) {
        item.durationString = item.durationString + mins.toString().padStart(2, '0');
        item.duration = { hours: item.duration.hours, minutes: mins };
      } else {
        item.durationString = item.durationString + '00';
      }
    }
    let params = this.planItemParamsFromItem(item);
    if (item.priority) params['priority'] = item.priority;
    if (item.fixedStart) params['fixedStart'] = true;
    this.updatePlanItem(params);
    return true;
  }

  updatePlanItem(params: {[index:  string]: any}): void{
    let hdrs = { 'content-type': 'application/x-www-form-urlencoded' }; 
    let url = dtConstants.apiTarget + dtConstants.setPlanItemEndpoint;
    let body = "";
    if (params["note"]) {
      body = '{ note: ' + params['note'] + ' }';
      delete params["note"];
    }
    this.http.post<[DTPlanItem]>(url, body, { headers: hdrs, params: params }).subscribe(data => {
      this.update();
    });
  }
}
