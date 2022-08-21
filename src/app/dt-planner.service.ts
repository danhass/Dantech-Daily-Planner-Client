import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DTColorCode, DtConstantsService, DTLogin, DTPlanItem, DTProject, DTStatus, DTUser } from './dt-constants.service';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class DtPlannerService {
  sessionId: string = "";
  planItems: Array<DTPlanItem> = [];
  stati: Array<DTStatus> = [];
  colorCodes: Array<DTColorCode> = [];
  projects: Array<DTProject> = [];
  
  constructor(
    private readonly constants: DtConstantsService,
    private http: HttpClient,
    private cookie: CookieService
  ) {   


  }

  initialize(): void {
    this.cookie.set(this.constants.values().dtPlannerServiceStatusKey, "initializing")
    let header = new HttpHeaders({'Content-Type':'text/plain'});
    let url = this.constants.values().apiTarget + this.constants.values().planStatiEndpoint;
        
    this.http.get<[DTStatus]>(url, {headers: header}).subscribe(data => {
      for (let i=0; i < data.length; i++){
        this.stati.push(data[i]);
      }
      url = this.constants.values().apiTarget + this.constants.values().planColorCodeEndpoint;
      this.http.get<[DTColorCode]>(url, {headers: header}).subscribe(data => {
        for (let i=0; i < data.length; i++){
          this.colorCodes.push(data[i]);
        }
        url = this.constants.values().apiTarget + this.constants.values().planItemsEndpoint + "?sessionId=" + this.sessionId;
        this.http.get<[DTPlanItem]>(url, {headers: {'Content-Type':'text/plain'}}).subscribe( data => {
          for (let i=0; i < data.length; i++) {
            this.planItems.push(data[i]);        
          }
          url = this.constants.values().apiTarget + this.constants.values().projectsEndpoint + "?sessionId=" + this.sessionId;
          console.log(url);
          this.http.get<[DTProject]>(url, {headers: header}).subscribe(data => {
            if (data) { for (let i=0; i < data.length; i++) {  this.projects.push(data[i]);  }  }
            console.log(this.projects);
            this.cookie.delete(this.constants.values().dtPlannerServiceStatusKey);
          })
        });
      });  
    }); 
  }

  setProject(aTitle: string, aShortCode: string, aStatusId: number): void {
    let url = this.constants.values().apiTarget + this.constants.values().setProjectEndpoint;
    let hdrs = {'content-type': 'application/x-www-form-urlencoded'};
    this.http.post<[DTProject]>(url, '', {headers: hdrs, params: {sessionId: this.sessionId, title: aTitle, shortCode: aShortCode, status: aStatusId}}).subscribe( data => {
      this.projects = [];
      if (data) { for (let i=0; i < data.length; i++) {  this.projects.push(data[i]);  }  }
    });    
  }

  setSession(newSession: string): void {
    this.sessionId = newSession;
  }

  PlanItems(): Array<DTPlanItem>{
    return this.planItems;
  }

  Projects(): Array<DTProject>{
    return this.projects;
  }

  Stati(): Array<DTStatus>{
    return this.stati;
  }
}
