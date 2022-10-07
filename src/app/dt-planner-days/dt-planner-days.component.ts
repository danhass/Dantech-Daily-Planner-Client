import { Component, OnInit } from '@angular/core';
import { DtData } from '../services/dt-data-store.service';
import { DTPlanItem, DTProject } from '../services/dt-constants.service';
import { DtPlannerService} from '../services/dt-planner.service';

@Component({
  selector: 'app-dt-planner-days',
  templateUrl: './dt-planner-days.component.html',
  styleUrls: ['./dt-planner-days.component.less']
})
export class DtPlannerDaysComponent implements OnInit {

  constructor(
    public dtPlanner: DtPlannerService,
    public data: DtData
  ) { }

  ngOnInit(): void {
  }

  changePlanItemProject(itemId: number, event: any): void {
    let itm = this.getPlanItemOrRecurrenceItem(itemId);
    if (itm != undefined && Number(this.data.editValueFirst) != itm.projectId) {
      let params = this.planItemParams(itm.id);
      params["projectId"] = Number(this.data.editValueFirst);
      this.dtPlanner.updatePlanItem(params);
    }
  }

  changePlanItemTitle(itemId: number, event: any): void {
    this.data.updateStatus = "Updating item";
    let itm = this.getPlanItemOrRecurrenceItem(itemId);
    if (itm != undefined && (itm.title != this.data.editValueFirst || itm.note != this.data.editValueSecond)) {
      let params = this.planItemParams(itm.id);
      params["title"] = this.data.editValueFirst;
      params["note"] = (this.data.editValueSecond == null || this.data.editValueSecond == 'null') ? null : this.data.editValueSecond;
      this.dtPlanner.updatePlanItem(params);
    }
  }

 dayOfWeek(date: any): string {
    let theDate = new Date(date);
    let returnValue = ("0" + (theDate.getMonth() + 1)).slice(-2) + "-" + ("0" + theDate.getDate()).slice(-2);
    if (this.data.notMobile()) {
      returnValue = this.fullDate(date);
    }
    return returnValue;
  }

  deletePlanItem(itemId: number) {
    this.data.updateStatus = "Deleting...";
    let item = (this.dtPlanner.planItems.find(x => x.id == itemId) as DTPlanItem);
    let proceed = confirm('Delete ' + item.title + "?");
    if (proceed) {
      this.dtPlanner.deletePlanItem(item);
    }
  }

 editItemEnd(event: any): void {
    if (event['key'] === 'Enter') {
      let itm = this.dtPlanner.planItems.find(x => x.id == this.data.itemBeingEdited);
      if (itm != undefined) {
        let params = this.planItemParams(itm.id);
        let numHrs = Number(this.data.editValueFirst);
        let numMins = Number(this.data.editValueSecond);
        let newStartTime = String(this.data.editValueFirst).padStart(2, '0') + ":" + String(this.data.editValueSecond).padStart(2, '0');
        if (newStartTime != params['startTime']) {
          numMins = numMins + itm.duration.minutes;
          numHrs = numHrs + itm.duration.hours;
          if (numMins >= 60) {
            numHrs = numHrs + 1;
            numMins = numMins - 60;
          }
          let newEndTime = String(numHrs).padStart(2, '0') + ":" + String(numMins).padStart(2,'0');                
          params['startTime'] = newStartTime;
          params['endTime'] = newEndTime;
          this.dtPlanner.updatePlanItem(params);
        }
        this.data.itemBeingEdited = 0;        
        this.data.fieldBeingEdited = "";
      }          
    } 
  }
  
  editItemStart(itemId: number | undefined, field: string): void {
    if (itemId == undefined) return;
    let itm = this.dtPlanner.planItems.find(x => x.id == itemId);
    let proj = undefined;
    if (itm == undefined) itm = this.dtPlanner.recurrenceItems.find(x => x.id == itemId);
    if (field == 'project-description') proj = this.dtPlanner.projects.find(x => x.id == itemId);
    if (itm == undefined) {
      this.data.itemBeingEdited = 0;
      this.data.fieldBeingEdited = '';
    }
    this.data.itemBeingEdited = (itemId as number);
    this.data.fieldBeingEdited = field;
    if (field == 'start') {
      this.data.editValueFirst = ((itm as DTPlanItem).startTime as string).split(':')[0];
      this.data.editValueSecond = ((itm as DTPlanItem).startTime as string).split(':')[1];
    }
    if (field == 'project') {
      this.data.editValueFirst = ((itm as DTPlanItem).projectId as number).toString();
    }
    if (field == 'title') {
      if (itm != undefined) {
        this.data.editValueFirst = itm.title;
        this.data.editValueSecond = itm.note == null || itm.note == 'null' ? "" : itm.note;
      }
    }
    if (field == 'project-description') {
      if (proj != undefined) {
        this.data.itemBeingEdited = itemId;
        this.data.fieldBeingEdited = 'project-description';
        this.data.editValueFirst = proj.title;
        this.data.editValueSecond = proj.notes;
        this.data.editValueThird = (proj.colorCodeId as number).toString();
      }
    }
  }

  fullDate(date: any): string {
    let theDate = new Date(date);
    return theDate.toLocaleDateString(undefined, { weekday: 'short' }) + " " +
      ("0" + (theDate.getMonth() + 1)).slice(-2) + "-" +
      ("0" + theDate.getDate()).slice(-2) + "-" +
      theDate.getFullYear();
  }

  getPlanItemOrRecurrenceItem(itemId: number): DTPlanItem | undefined {
    let itm = this.dtPlanner.planItems.find(x => x.id == itemId);
    if (itm == undefined) itm = this.dtPlanner.recurrenceItems.find(x => x.id == itemId);
    return itm;
  }
  
  movePlanItemToNextDay(itemId: number) {
    this.data.updateStatus = "Updating item";
    let params = this.planItemParams(itemId);
    let start = new Date(params["start"]);
    start.setDate(start.getDate() + 1);
    let end = new Date(params["end"]);
    end.setDate(end.getDate() + 1);
    params["start"] = start.toLocaleDateString();
    params["end"] = end.toLocaleDateString();
    this.dtPlanner.updatePlanItem(params);
  }

  planItemDateChanged(date: any): boolean {
    let thisDate = this.dayOfWeek(date);
    let changed = false;
    if (thisDate != this.data.currentPlanItemDate) {
      changed = true;
      this.data.currentPlanItemDate = thisDate;
    }
    return changed;
  }

  planItemParams(itemId: number): { [index: string]: any } {
    let item = this.dtPlanner.planItems.find(x => x.id == itemId) as DTPlanItem;
    if (item == undefined) item = this.dtPlanner.recurrenceItems.find(x => x.id == itemId) as DTPlanItem;
    let start = new Date(item.start);
    start.setDate(start.getDate());
    let end = new Date(start.toLocaleDateString());
    end.setHours(start.getHours() + item.duration.hours);
    end.setMinutes(start.getMinutes() + item.duration.minutes);
    let endTime = end.getHours().toString().padStart(2, "0") + ":" + end.getMinutes().toString().padStart(2, "0");
    let params: { [index: string]: any } = {
      sessionId: this.data.sessionId,
      title: item.title,
      note: item.note,
      start: start.toLocaleDateString(),
      startTime: item.startTime,
      end: end.toLocaleDateString(),
      endTime: endTime,
      priority: null,
      addToCalendar: null,
      completed: item.completed,
      preserve: null,
      projectId: item.projectId,
      daysBack: 1,
      includeCompleted: true,
      getAll: false,
      onlyProject: 0,
      id: item.id,
      recurrence: item.recurrence,
      recurrenceData: item.recurrenceData
    };
      
    return params;
  }

  togglePlanItemCompleted(itemId: number, event: any): void {
    this.data.updateStatus = "Updating item";
    let completed = event.srcElement.checked;
    let params = this.planItemParams(itemId);
    params["completed"] = completed;
    this.dtPlanner.updatePlanItem(params);
  }

  tooltipFormatted(s:string): string {
    let result = s.replaceAll("\n", "<br />\n");
    return result;
  }
}
