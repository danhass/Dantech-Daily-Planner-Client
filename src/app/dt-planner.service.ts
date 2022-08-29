import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { dtConstants, DTColorCode, DTLogin, DTPlanItem, DTProject, DTStatus, DTUser } from './dt-constants.service';
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
  stati: Array<DTStatus> = [];
  colorCodes: Array<DTColorCode> = [];
  private componentMethodCallSource = new Subject<any>();
  componentMethodCalled$ = this.componentMethodCallSource.asObservable();

  constructor(
    private http: HttpClient,
    private cookie: CookieService
  ) {   


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
        url = dtConstants.apiTarget + dtConstants.planItemsEndpoint + "?sessionId=" + this.sessionId + "&includeCompleted=true";
        this.http.get<[DTPlanItem]>(url, {headers: {'Content-Type':'text/plain'}}).subscribe( data => {
          this.setPlanItems(data);
          url = dtConstants.apiTarget + dtConstants.projectsEndpoint + "?sessionId=" + this.sessionId;
          this.http.get<[DTProject]>(url, {headers: header}).subscribe(data => {
            DtProjects = [];
            this.setProjects(data);
            for (let i=0; i < this.planItems.length; i++) {
              let dateBuffer = new Date(this.planItems[i].start as Date);        
              this.planItems[i].startTime = dateBuffer.getHours().toString().padStart(2, "0")  + ":" + dateBuffer.getMinutes().toString().padStart(2, "0");
                    this.planItems[i].durationString = (this.planItems[i].duration.hours > 0 || this.planItems[i].duration.minutes > 0) ?
                this.planItems[i].duration.hours.toString().padStart(2, "0") + ":" + 
                this.planItems[i].duration.minutes.toString().padStart(2,"0") : "";
              this.planItems[i].project = DtProjects.find( x => x.id == this.planItems[i].projectId);
            }
            this.cookie.delete(dtConstants.dtPlannerServiceStatusKey);
            this.pingComponents("dtPlanner init complete");
          })
        });
      });  
    }); 
  }

  pingComponents(msg: string){
    this.componentMethodCallSource.next(msg);
  }

  setPlanItems(data: Array<DTPlanItem>): void {
    if (data) {
      this.planItems = [];
      for (let i=0; i< data.length; i++) {
        this.planItems.push(data[i]);
        let dateBuffer = new Date(this.planItems[i].start as Date);        
        this.planItems[i].startTime = dateBuffer.getHours().toString().padStart(2, "0")  + ":" + dateBuffer.getMinutes().toString().padStart(2, "0");
        this.planItems[i].durationString = (this.planItems[i].duration.hours > 0 || this.planItems[i].duration.minutes > 0) ?        
          this.planItems[i].duration.hours.toString().padStart(2, "0") + ":" +           
          this.planItems[i].duration.minutes.toString().padStart(2,"0") : "";   
        this.planItems[i].project = DtProjects.find( x => x.id == this.planItems[i].projectId);
      }
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

  PlanItems(): Array<DTPlanItem>{
    return this.planItems;
  }

 getProjects(): Array<DTProject>{
    return DtProjects;
  }

  Stati(): Array<DTStatus>{
    return this.stati;
  }

  ColorCodes(): Array<DTColorCode>{
    return this.colorCodes;
  }
}
