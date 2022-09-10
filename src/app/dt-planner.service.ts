import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { dtConstants, DTColorCode, DTLogin, DTPlanItem, DTProject, DTStatus, DTUser, DTRecurrence } from './dt-constants.service';
import { CookieService } from 'ngx-cookie-service';
import { Observable, Subject } from 'rxjs';
import { Time } from '@angular/common';

export let DtProjects: Array<DTProject> = [];

@Injectable({
  providedIn: 'root'
})

export class DtPlannerService {
  sessionId: string = "";
  planItems: Array<DTPlanItem> = [];
  recurrenceItems: Array<DTPlanItem>=[];
  stati: Array<DTStatus> = [];
  colorCodes: Array<DTColorCode> = [];
  recurrences: Array<DTRecurrence> = [];
  private componentMethodCallSource = new Subject<any>();
  componentMethodCalled$ = this.componentMethodCallSource.asObservable();

  constructor(
    private http: HttpClient,
    private cookie: CookieService
  ) {   


  }

  getColorCodes(): Array<DTColorCode>{
    return this.colorCodes;
  }

  getPlanItems(): Array<DTPlanItem>{
    return this.planItems;
  }

  getProjects(): Array<DTProject>{
    return DtProjects;
  }

  getRecurrenceItems(): Array<DTPlanItem>{
    return this.recurrenceItems;
  }

  getRecurrences(): Array<DTRecurrence>{
    return this.recurrences;
  }

  getStati(): Array<DTStatus>{
    return this.stati;
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
              DtProjects = [];
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

  linkPlanItemsToProjects(items: Array<DTPlanItem>) {
    let flag = this.cookie.get(dtConstants.dtPlannerServiceStatusKey);
    if (flag == null || flag.length == 0) {
      for (let i=0; i < items.length; i++) {
        items[i].project = DtProjects.find( x => x.id == items[i].projectId);
      }
    }
  }

  pingComponents(msg: string){
    this.componentMethodCallSource.next(msg);
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
        items[i].project = DtProjects.find( x => x.id == items[i].projectId);
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
      DtProjects = [];
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
        DtProjects.push(data[i]); 
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
}
