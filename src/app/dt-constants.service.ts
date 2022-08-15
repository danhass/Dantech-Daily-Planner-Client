import { Time } from '@angular/common';
import { Injectable } from '@angular/core';
import { session } from './google-handler/google-handler.component';

export interface DTLogin {
  session: string,
  fName: string,
  lName: string,
  email: string,
  message: string
}

export interface DTUser {
  id: number,
  email: string,
  fName: string,
  lastLogin: Date,
  otherName: null,
  refreshToken: string,
  session: string,
  suspending: boolean,
  token: string
}

export interface DTPlanItem {
  id: number,
  addToCalendar: boolean,
  completed: boolean,
  day: Date,
  duration: Time,
  note: string | undefined,
  priority: number,
  project: string | undefined,
  projectMnemonic: string,
  projectTitle: string,
  start: Date | undefined,
  title: string
}


const dtSessionKey = "dtSessionId";
const apiTarget = "https://localhost:44324";
//const apiTarget = "https://7822-54268.el-alt.com";
const loginEndpoint = "/login";
const planItemsEndpoint = "/Planner/PlanItems"

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
  
  planItemsEndpoint(): string {
    return planItemsEndpoint;
  }
}
