import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { dtConstants, DTColorCode, DTLogin, DTPlanItem, DTProject, DTStatus, DTUser, DTRecurrence } from './dt-constants.service';
import { CookieService } from 'ngx-cookie-service';
import { Observable, Subject } from 'rxjs';
import { Time } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class DtPlannerService {
  public colorCodes: Array<DTColorCode> = [];
  private componentMethodCallSource = new Subject<any>();
  componentMethodCalled$ = this.componentMethodCallSource.asObservable();
  public firstPlanItemId: number = 0;
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
    this.http.post<[DTPlanItem]>(url, '', { headers: hdrs, params: params }).subscribe(data => {
      let newPlanItems: Array<DTPlanItem> = [];
      if (data) {
        for (let i = 0; i < data.length; i++) {
          newPlanItems = [...newPlanItems, data[i]];
        }
      }
      this.setPlanItems(newPlanItems);
      this.pingComponents("Item added.");
    });
  }
  
  addProject(params: { [index: string]: any }): void {
    let url = dtConstants.apiTarget + dtConstants.setProjectEndpoint;
    let hdrs = { 'content-type': 'application/x-www-form-urlencoded' };
    this.http.post<[DTProject]>(url, '', { headers: hdrs, params: params }).subscribe(data => {
      let newProjects: Array<DTProject> = [];
      if (data) { for (let i = 0; i < data.length; i++) { newProjects = [...newProjects, data[i]]; } }
      this.setProjects(newProjects);
      this.pingComponents("Project Added.");
    });
  }

  deletePlanItem(itemId: number) {
    let item = (this.planItems.find(x => x.id == itemId) as DTPlanItem);    
    let hdrs = { 'content-type': 'application/x-www-form-urlencoded' };    
    let params: { [index: string]: any } = {      
      sessionId: this.sessionId,      
      planItemId: item.id    
    }      
    let url = dtConstants.apiTarget + dtConstants.deletePlanItemEndpoint;    
    this.http.post<[DTPlanItem]>(url, '', { headers: hdrs, params: params }).subscribe(data => {    
      url = dtConstants.apiTarget + dtConstants.planItemsEndpoint + "?sessionId=" + this.sessionId + "&includeCompleted=true";    
      this.http.get<[DTPlanItem]>(url, { headers: { 'Content-Type': 'text/plain' } }).subscribe(data => {    
        this.setPlanItems(data);    
        this.pingComponents("Delete complete.")    
      });    
    });    
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

  deleteRecurrence(itemId: number, deleteChildren: boolean) {
    let hdrs = { 'content-type': 'application/x-www-form-urlencoded' };    
    let params: { [index: string]: any } = {      
      sessionId: this.sessionId,      
      planItemId: itemId,
      deleteChildren: deleteChildren    
    }      
    let url = dtConstants.apiTarget + dtConstants.deletePlanItemEndpoint;    
    this.http.post<[DTPlanItem]>(url, '', { headers: hdrs, params: params }).subscribe(data => {    
      this.update();
    });        
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
        url = dtConstants.apiTarget + dtConstants.populateEndpoint + "?sessionId=" + this.sessionId;
        this.http.get<any>(url, {headers: header}).subscribe(data => {        
          url = dtConstants.apiTarget + dtConstants.recurrencesEndpoint + "?sessionId=" + this.sessionId;
          this.http.get<[DTRecurrence]>(url, {headers: header}).subscribe(data => {        
            for (let i=0; i < data.length; i++){ 
              this.recurrences.push(data[i]);        
            }
            url = dtConstants.apiTarget + dtConstants.planItemsEndpoint + "?sessionId=" + this.sessionId + "&includeCompleted=true";
            this.http.get<[DTPlanItem]>(url, {headers: {'Content-Type':'text/plain'}}).subscribe( data => {
              this.setPlanItems(data);
              url = dtConstants.apiTarget + dtConstants.projectsEndpoint + "?sessionId=" + this.sessionId;
              this.http.get<[DTProject]>(url, {headers: header}).subscribe(data => {
                this.projects = [];
                this.setProjects(data);
                this.cookie.delete(dtConstants.dtPlannerServiceStatusKey);
                this.linkPlanItemsToProjects(this.planItems);
                url = dtConstants.apiTarget + dtConstants.planItemsEndpoint + "?sessionId=" + this.sessionId + "&includeCompleted=true&getAll=true&onlyRecurrences=true";
                this.http.get<[DTPlanItem]>(url, {headers: {'Content-Type':'text/plain'}}).subscribe( data => {
                  this.setRecurrenceItems(data);
                  this.pingComponents("dtPlanner init complete");
                })
              });
            });
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
      }
    }
  }

  loadProjectItems(projId: number): void {
    let url = dtConstants.apiTarget + dtConstants.planItemsEndpoint + "?sessionId=" + this.sessionId + "&includeCompleted=true&getAll=true&onlyProject=" + projId;
    this.http.get<[DTPlanItem]>(url, {headers: {'Content-Type':'text/plain'}}).subscribe( data => {
      let items = this.setItems(data);
      this.projectItems = items;
      this.pingComponents("Project items loaded.");
    });
  }

  pingComponents(msg: string){
    this.componentMethodCallSource.next(msg);
  }
  
  planItemParams(itemId: number): { [index: string]: any } {
    let item = this.planItems.find(x => x.id == itemId) as DTPlanItem;
    if (item == undefined) item = this.recurrenceItems.find(x => x.id == itemId) as DTPlanItem;
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
      for (let i=0; i< data.length; i++) {
        items.push(data[i]); 
        items[i].dayString = new Date(items[i].day as Date).toDateString();
        let dateBuffer = new Date(items[i].start as Date);        
        items[i].startTime = dateBuffer.getHours().toString().padStart(2, "0")  + ":" + dateBuffer.getMinutes().toString().padStart(2, "0");
        items[i].durationString = (items[i].duration.hours > 0 || items[i].duration.minutes > 0) ?        
          items[i].duration.hours.toString().padStart(2, "0") + ":" +           
          items[i].duration.minutes.toString().padStart(2,"0") : "";   
        items[i].project = this.projects.find( x => x.id == items[i].projectId);
        if (items[i].project) {
          items[i].projectTitle = (items[i].project?.title as string);
        }
      }
      for (let i=0; i< items.length; i++) {      
        let dateBuffer = new Date(items[i].start as Date);  
        items[i].startTime = dateBuffer.getHours().toString().padStart(2, "0")  + ":" + dateBuffer.getMinutes().toString().padStart(2, "0");
            items[i].durationString = (items[i].duration.hours > 0 || items[i].duration.minutes > 0) ?
        items[i].duration.hours.toString().padStart(2, "0") + ":" + 
        items[i].duration.minutes.toString().padStart(2,"0") : "";
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
    }
  }

  setSession(newSession: string): void {
    this.sessionId = newSession;
  }

  update(): void {
    this.updateStatus = 'Updating...';
    let url = dtConstants.apiTarget + dtConstants.planItemsEndpoint + "?sessionId=" + this.sessionId + "&includeCompleted=true";
    this.http.get<[DTPlanItem]>(url, {headers: {'Content-Type':'text/plain'}}).subscribe( data => {
      this.setPlanItems(data);
      url = dtConstants.apiTarget + dtConstants.planItemsEndpoint + "?sessionId=" + this.sessionId + "&includeCompleted=true&getAll=true&onlyRecurrences=true";
      this.http.get<[DTPlanItem]>(url, {headers: {'Content-Type':'text/plain'}}).subscribe( data => {
        this.setRecurrenceItems(data);
        if (this.projectItems.length > 0) {
          let projId = (this.projectItems[0].projectId as number);
          //this.loadProjectItems(projId);
          url = dtConstants.apiTarget + dtConstants.projectsEndpoint + "?sessionId=" + this.sessionId;
          this.http.get<[DTProject]>(url, {headers: {'Content-Type':'text/plain'}}).subscribe(data => {
            this.projects = [];
            this.setProjects(data);
            this.projectItems = this.recurrenceItems.filter(x => x.project != undefined && x.project.id == projId);
            this.projectItems = this.projectItems.concat(this.planItems.filter(x => x.project != undefined && x.project.id == projId));
            this.cookie.delete(dtConstants.dtPlannerServiceStatusKey);
            this.linkPlanItemsToProjects(this.planItems);
            this.updateStatus = '';         
            this.pingComponents("dtPlanner update complete");
          });
        } else {
          this.updateStatus = '';         
          this.pingComponents("dtPlanner update complete");
        }      
      });           
    });  
  }

  updatePlanItem(params: {[index:  string]: any}): void{
    let hdrs = { 'content-type': 'application/x-www-form-urlencoded' }; 
    let url = dtConstants.apiTarget + dtConstants.setPlanItemEndpoint;
    this.http.post<[DTPlanItem]>(url, '', { headers: hdrs, params: params }).subscribe(data => {
      let newPlanItems: Array<DTPlanItem> = [];
      if (data) {
        for (let i = 0; i < data.length; i++) {
          newPlanItems = [...newPlanItems, data[i]];
        }
      }
      this.setPlanItems(newPlanItems);
      this.firstPlanItemId = (this.planItems.find(x => x.recurrence == undefined || x.recurrence < 1) as DTPlanItem).id; 
      url = dtConstants.apiTarget + dtConstants.planItemsEndpoint + "?sessionId=" + this.sessionId + "&includeCompleted=true&getAll=true&onlyRecurrences=true";
      this.http.get<[DTPlanItem]>(url, {headers: {'Content-Type':'text/plain'}}).subscribe( data => {
        this.setRecurrenceItems(data);
        this.pingComponents("Plan item updated.")
        if (this.projectItems.length > 0) {
          let projId = (this.projectItems[0].projectId as number);
          this.loadProjectItems(projId);
        }
      })   
    });
  }
}
