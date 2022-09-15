import { Injectable } from '@angular/core';
import { dtConstants, DTLogin } from './dt-constants.service';

// The point here is to expose data that can be used across all components.

@Injectable({
  providedIn: 'root'
})
export class DtData {

  public login: DTLogin | null = null;
  public loginComplete: boolean | undefined = undefined;
  public sessionId: string = "";
  public test: string | undefined = undefined;
  public timeStamp: string = new Date().toLocaleString();

  constructor() { }
}
