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
  public sessionId: string = "";
  public planItems: Array<DTPlanItem> = [];
  public recurrenceItems: Array<DTPlanItem>=[];
  public stati: Array<DTStatus> = [];
  public colorCodes: Array<DTColorCode> = [];
  public recurrences: Array<DTRecurrence> = [];
  public projects: Array<DTProject> = [];
  public projectItems: Array<DTPlanItem> = [];
  public firstPlanItemId: number = 0;
  private componentMethodCallSource = new Subject<any>();
  componentMethodCalled$ = this.componentMethodCallSource.asObservable();

  constructor(
    private http: HttpClient,
    private cookie: CookieService
  ) {   
  }

  addPlanItem(params: { [index: string]: any }): void {
    let url = dtConstants.apiTarget + dtConstants.setPlanItemEndPoint;
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
    let url = dtConstants.apiTarget + dtConstants.deletePlanItemEndPoint;    
    this.http.post<[DTPlanItem]>(url, '', { headers: hdrs, params: params }).subscribe(data => {    
      url = dtConstants.apiTarget + dtConstants.planItemsEndpoint + "?sessionId=" + this.sessionId + "&includeCompleted=true";    
      this.http.get<[DTPlanItem]>(url, { headers: { 'Content-Type': 'text/plain' } }).subscribe(data => {    
        this.setPlanItems(data);    
        this.pingComponents("Delete complete.")    
      });    
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
        url = dtConstants.apiTarget + dtConstants.recurrencesEndPoint;
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
              this.pingComponents("dtPlanner init complete");
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
      this.projectItems = this.setItems(data);
    });

  }

  pingComponents(msg: string){
    this.componentMethodCallSource.next(msg);
  }

  propagateRecurrence(itemId: number): void {
    let url = dtConstants.apiTarget + dtConstants.propagateEndPoint + "?sessionId=" + this.sessionId + "&seedId=" + itemId;
    this.http.get<[boolean]>(url, {headers: {'Content-Type':'text/plain'}}).subscribe( data => {    
      if (data) {
        this.update();
      }        
    });
  }

  setItems (data: Array<DTPlanItem>): Array<DTPlanItem> {
    let items: Array<DTPlanItem> = [];
    if (data) {
      for (let i=0; i< data.length; i++) {
        items.push(data[i]);
        let dateBuffer = new Date(items[i].start as Date);        
        items[i].startTime = dateBuffer.getHours().toString().padStart(2, "0")  + ":" + dateBuffer.getMinutes().toString().padStart(2, "0");
        items[i].durationString = (items[i].duration.hours > 0 || items[i].duration.minutes > 0) ?        
          items[i].duration.hours.toString().padStart(2, "0") + ":" +           
          items[i].duration.minutes.toString().padStart(2,"0") : "";   
        items[i].project = this.projects.find( x => x.id == items[i].projectId);
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
    let url = dtConstants.apiTarget + dtConstants.planItemsEndpoint + "?sessionId=" + this.sessionId + "&includeCompleted=true";
    this.http.get<[DTPlanItem]>(url, {headers: {'Content-Type':'text/plain'}}).subscribe( data => {
      this.setPlanItems(data);
      this.linkPlanItemsToProjects(this.planItems);
      url = dtConstants.apiTarget + dtConstants.planItemsEndpoint + "?sessionId=" + this.sessionId + "&includeCompleted=true&getAll=true&onlyRecurrences=true";
      this.http.get<[DTPlanItem]>(url, {headers: {'Content-Type':'text/plain'}}).subscribe( data => {
        this.setRecurrenceItems(data);
        this.pingComponents("dtPlanner update complete");
      });
    });
  }

  updatePlanItem(params: {[index:  string]: any}): void{
    let hdrs = { 'content-type': 'application/x-www-form-urlencoded' }; 
    let url = dtConstants.apiTarget + dtConstants.setPlanItemEndPoint;
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
      })   
    });
  }

}
