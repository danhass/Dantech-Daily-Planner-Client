import { Time, WeekDay } from '@angular/common';
import { Injectable } from '@angular/core';
import { session } from '../google-handler/google-handler.component';

export const dtConstants = {
  dtSessionKey : "dtSessionId",
  dtPlannerServiceStatusKey : "dtPlannerService",
  //apiTarget : "https://localhost:44324",
  apiTarget : "https://7822-54268.el-alt.com",
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
  setProjectEndpoint: "/Planner/SetProject",
  setPlanItemEndpoint: "/Planner/SetPlanItem"
}

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
  title: string,
  note: string | undefined,
  start: Date,
  startTime: string
  addToCalendar: boolean,
  completed: boolean,
  day: Date,
  dayString: string,
  duration: Time,
  durationString: string,
  parent: number | undefined,
  priority: number,
  projectId: number | undefined,
  project: DTProject | undefined,
  projectTitle: string,
  recurrence: number | undefined,
  recurrenceData: string | undefined,
  recurrenceName: string | undefined,
  statusColor: string | undefined
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

export function itemStatus(item: DTPlanItem | undefined): string {
  let now = new Date();
  let start = new Date(item?.start as Date);
  let end = new Date(item?.start as Date)
  end.setHours(start.getHours() + (item as DTPlanItem).duration.hours);
  end.setMinutes(start.getMinutes() + (item as DTPlanItem).duration.minutes);

  let nowDate = now.toLocaleDateString();
  let nowTime = now.toLocaleTimeString();
  let startDate = start.toLocaleDateString();
  let startTime = start.toLocaleTimeString();
  let endDate = end.toLocaleDateString();
  let endTime = end.toLocaleTimeString();

  let statusColor = "LightGray";
  if (startDate == nowDate) statusColor = "LightGoldenrodYellow"
  if (startDate == nowDate && start < now) statusColor = "Khaki";
  if (endDate == nowDate && end < now) statusColor = "LightPink";
  if (new Date(startDate) < new Date(nowDate)) statusColor = "Pink";
  if (item?.completed == true) statusColor = "DarkSeaGreen";
  return statusColor;
}

@Injectable({
  providedIn: 'root'
})

export class DtConstantsService {
  constructor() {}  
}
