import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DtConstantsService, DTLogin, DTPlanItem, DTUser } from './dt-constants.service';


@Injectable({
  providedIn: 'root'
})
export class DtPlannerService {

  sessionId: string = "";
  planItems: Array<DTPlanItem> = [];

  constructor(
    private readonly constants: DtConstantsService,
    private http: HttpClient
  ) {            
  }

  setSession(newSession: string): void {
    this.sessionId = newSession;
    console.log("New session id: ", newSession);
    let url = this.constants.apiTarget() + this.constants.planItemsEndpoint() + "?sessionId=" + this.sessionId;
    console.log(url);
    
    this.http.get<[DTPlanItem]>(url).subscribe( data => {
      console.log("Plan items: ", data); 
      for (let i=0; i < data.length; i++)
      {
        console.log(data[i]);
        this.planItems.push(data[i]);
      }
      console.log("Loaded items: ", this.planItems);
    });
  }

  PlanItems(): Array<DTPlanItem>{
    return this.planItems;
  }
}
