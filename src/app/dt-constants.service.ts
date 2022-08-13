import { Injectable } from '@angular/core';

export interface DTLogin {
  session: string,
  fName: string,
  lName: string,
  email: string,
  message: string
}


const dtSessionKey = "dtSessionId";
//const apiTarget = "https://localhost:44324";
const apiTarget = "https://7822-54268.el-alt.com";
const loginEndpoint = "/login";

@Injectable({
  providedIn: 'root'
})
export class DtConstantsService {

  constructor() { }

  dtSessionKey(): string {
    return dtSessionKey;
  }
  
  apiTarget(): string {
    return apiTarget;
  }
  
  loginEndpoint(): string {
    return loginEndpoint;
  }
}
