import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DTColorCode, DtConstantsService, DTLogin, DTPlanItem, DTStatus, DTUser } from './dt-constants.service';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class DtPlannerService {
  sessionId: string = "";
  planItems: Array<DTPlanItem> = [];
  stati: Array<DTStatus> = [];
  colorCodes: Array<DTColorCode> = [];
  
  constructor(
    private readonly constants: DtConstantsService,
    private http: HttpClient,
    private cookie: CookieService
  ) {   

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
        this.cookie.delete(this.constants.values().dtPlannerServiceStatusKey);
      });  
    }); 
  }

  setSession(newSession: string): void {
    this.sessionId = newSession;
    let url = this.constants.values().apiTarget + this.constants.values().planItemsEndpoint + "?sessionId=" + this.sessionId;
    let header = new HttpHeaders({'Content-Type':'text/plain'});
    this.http.get<[DTPlanItem]>(url, {headers: header}).subscribe( data => {
      for (let i=0; i < data.length; i++) {
        this.planItems.push(data[i]);        
      }
    });
  }

  PlanItems(): Array<DTPlanItem>{
    return this.planItems;
  }
}
