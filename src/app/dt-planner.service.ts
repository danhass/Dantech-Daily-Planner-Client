import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { dtConstants, DTColorCode, DTLogin, DTPlanItem, DTProject, DTStatus, DTUser } from './dt-constants.service';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

export let DtProjects: Array<DTProject> = [];

@Injectable({
  providedIn: 'root'
})

export class DtPlannerService {
  sessionId: string = "";
  planItems: Array<DTPlanItem> = [];
  stati: Array<DTStatus> = [];
  colorCodes: Array<DTColorCode> = [];
  
  constructor(
    private http: HttpClient,
    private cookie: CookieService
  ) {   


  }

  initialize(): void {
    this.cookie.set(dtConstants.dtPlannerServiceStatusKey, "initializing")
    let header = new HttpHeaders({'Content-Type':'text/plain'});
    let url = dtConstants.apiTarget + dtConstants.planStatiEndpoint;
        
    this.http.get<[DTStatus]>(url, {headers: header}).subscribe(data => {
      for (let i=0; i < data.length; i++){
        this.stati.push(data[i]);
      }
      url = dtConstants.apiTarget + dtConstants.planColorCodeEndpoint;
      this.http.get<[DTColorCode]>(url, {headers: header}).subscribe(data => {
        for (let i=0; i < data.length; i++){
          this.colorCodes.push(data[i]);
        }
        url = dtConstants.apiTarget + dtConstants.planItemsEndpoint + "?sessionId=" + this.sessionId;
        this.http.get<[DTPlanItem]>(url, {headers: {'Content-Type':'text/plain'}}).subscribe( data => {
          for (let i=0; i < data.length; i++) {
            this.planItems.push(data[i]);        
          }
          url = dtConstants.apiTarget + dtConstants.projectsEndpoint + "?sessionId=" + this.sessionId;
          this.http.get<[DTProject]>(url, {headers: header}).subscribe(data => {
            if (data) { for (let i=0; i < data.length; i++) {  DtProjects.push(data[i]); }  }
            this.cookie.delete(dtConstants.dtPlannerServiceStatusKey);
          })
        });
      });  
    }); 
  }

  setProjects(aProjects: Array<DTProject>): void {    
    DtProjects = aProjects;
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
}
