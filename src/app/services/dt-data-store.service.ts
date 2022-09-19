import { Injectable } from '@angular/core';
import { dtConstants, DTLogin, DTProject, DTPlanItem } from './dt-constants.service';

// The point here is to expose data that can be used across all components.

@Injectable({
  providedIn: 'root'
})
export class DtData {

  public editValueFirst: string = "";
  public editValueSecond: string = "";
  public editValueThird: string = "";
  public fieldBeingEdited: string = "";
  public itemBeingEdited: number = 0;
  public login: DTLogin | null = null;
  public loginComplete: boolean | undefined = undefined;
  public projectVisible: boolean = false;
  public sessionId: string = "";
  public targetProject: DTProject | undefined = undefined;
  public test: string | undefined = undefined;
  public timeStamp: string = new Date().toLocaleString();
  public projectItems: Array<DTPlanItem> = [];

  constructor() {    
   }
}
