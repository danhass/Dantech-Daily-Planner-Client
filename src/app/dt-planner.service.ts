import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DtConstantsService, DTLogin, DTPlanItem, DTStatus, DTUser } from './dt-constants.service';


@Injectable({
  providedIn: 'root'
})
export class DtPlannerService {

  sessionId: string = "";
  planItems: Array<DTPlanItem> = [];
  stati: Array<DTStatus> = [];

  constructor(
    private readonly constants: DtConstantsService,
    private http: HttpClient
  ) {   
    let url = this.constants.apiTarget() + this.constants.planStatiEndpoint();
    let header = new HttpHeaders({'Content-Type':'text/plain'});
    //console.log (url);
    /*
    this.http.get<[DTStatus]>(url, {headers: header}).subscribe(data => {
      console.log("Data: ", data);
      for (let i=0; i < data.length; i++){
        this.stati.push(data[i]);
      }
    });
    */
  }

  setSession(newSession: string): void {
    this.sessionId = newSession;
    let url = this.constants.apiTarget() + this.constants.planItemsEndpoint() + "?sessionId=" + this.sessionId;
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
