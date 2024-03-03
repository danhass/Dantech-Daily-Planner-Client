import { Time, WeekDay } from '@angular/common';
import { Injectable } from '@angular/core';
import { session } from '../google-handler/google-handler.component';

export const dtConstants = {
  dtSessionKey : "dtSessionId",
  dtPlannerServiceStatusKey : "dtPlannerService",
  adjustEndpoint: "/Planner/Adjust",
  apiTarget : "https://localhost:44324",
  //apiTarget : "https://7822-54268.el-alt.com",
  deletePlanItemEndpoint: "/Planner/DeletePlanItem",
  deleteProjectEndpoint: "/Planner/DeleteProject",
  loginEndpoint : "/login",
  planItemsEndpoint : "/Planner/PlanItems",
  planStatiEndpoint : "/Planner/Stati",
  planColorCodeEndpoint : "/Planner/ColorCodes",
  populateEndpoint : '/Planner/PopulateRecurrences',
  propagateEndpoint: "/Planner/Propagate",
  projectsEndpoint: "/Planner/Projects",
  recurrencesEndpoint: "/Planner/Recurrences",
  sentToGoogleFlag: "sentToGoogle",
  setOrClearDoNotSetPWFlag: "/Admin/SetOrClearDoNotSetPWFlag",
  setProjectEndpoint: "/Planner/SetProject",
  setPlanItemEndpoint: "/Planner/SetPlanItem",
  setPWEndPoint: "/Admin/SetPW"
}

export interface DTLogin {
  session: string,
  fName: string,
  lName: string,
  email: string,
  doNotSetPW: boolean | null,
  message: string
}

export interface DTUser {
  id: number,
  email: string,
  fName: string,
  lastLogin: Date,
  otherName: null | undefined | string,
  refreshToken: string,
  session: string,
  suspending: boolean,
  token: string
}

export interface DTPlanItem {
  addToCalendar: boolean,
  completed: boolean,
  day: Date,
  dayString: string,
  duration: Time,
  durationHour: string,
  durationMinutes: string,
  durationString: string,
  fixedStart: boolean,
  id: number,
  note: string | undefined,
  parent: number | undefined,
  priority: number,
  project: DTProject | undefined,
  projectId: number | undefined,
  projectMnemonic: string,
  projectTitle: string,
  recurrence: number | undefined,
  recurrenceData: string | undefined,
  recurrenceName: string | undefined,
  start: Date,
  startHour: string,
  startMinutes: string,
  startTime: string
  statusColor: string | undefined,
  title: string,
  touched: boolean
}

export class DTEmptyPlanItem implements DTPlanItem {
  id = 0;
  title = '';
  note = undefined;
  start = new Date();
  startTime = '00:00';
  startHour = '00';
  startMinutes = '00';
  addToCalendar = false;
  completed = false;
  day = new Date();
  dayString = new Date().toDateString();
  duration = { hours: 0, minutes: 0 };
  durationString = '00:00';
  durationHour = '00';
  durationMinutes = '00';
  parent = undefined;
  priority = 0;
  projectId = undefined;
  project = undefined;
  projectMnemonic = '';
  projectTitle = '';
  recurrence = undefined;
  recurrenceData = undefined;
  recurrenceName = undefined;
  statusColor = undefined;
  fixedStart = false;
  touched = false;
}

export interface DTStatus {
  id: number,
  title: string,
  note: string | undefined,
  colorCode: number | undefined,
  color: DTColorCode | undefined,
  colorString: string
}

export interface DTColorCode {
  id: number,
  title: string,
  note: string | undefined
}

export interface DTConstants {
  dtSessionKey: string,
  dtPlannerServiceStatusKey: string,
  apiTarget: string,
  loginEndpoint: string,
  planItemsEndpoint: string,
  planStatiEndpoint: string,
  planColorCodeEndpoint:string,
  projectsEndpoint:string,
  sentToGoogleFlag:string,
  setProjectEndpoint: string
}

export interface DTProject {
  id: number,
  title: string,
  shortCode: string,
  priority: number | undefined,
  sortOrder: number | undefined,
  user: DTUser,
  colorCodeId: number | undefined,
  color: DTColorCode | undefined,
  colorString: string,  
  status: number,
  statusObj: DTStatus,
  notes: string
}

export interface DTRecurrence {
  id: number,
  title: string,
  note: string | undefined,
  description: string | undefined,
  effective: Date | undefined,
  stops: Date | undefined,
  daysToPopulate: number | undefined
}

@Injectable({
  providedIn: 'root'
})

export class DtConstantsService {
  constructor() {}  
}
