import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DtPlannerService } from '../services/dt-planner.service';
import { DtData} from '../services/dt-data-store.service';
import { DTPlanItem } from '../services/dt-constants.service';

@Component({
  selector: 'app-dt-plan-item',
  templateUrl: './dt-plan-item.component.html',
  styleUrls: ['./dt-plan-item.component.less']
})
export class DtPlanItemComponent implements OnInit, OnChanges {
  @Input() item: DTPlanItem | undefined;
  @Input() category: string = "";

  constructor(
    public dtPlanner: DtPlannerService,
    public data: DtData
  ) { 
    this.processPlannerServiceResult("");
  }

  changePlanItemTitle(itemId: number | undefined, event: any): void {
    this.data.updateStatus = "Updating item";
    let itm = this.getPlanItemOrRecurrenceItem((itemId as number));
    if (itm != undefined && (itm.title != this.data.editValueFirst || itm.note != this.data.editValueSecond)) {
      let params = this.planItemParams(itm.id);
      params["title"] = this.data.editValueFirst;
      params["note"] = (this.data.editValueSecond == null || this.data.editValueSecond == 'null') ? null : this.data.editValueSecond;
      this.dtPlanner.updatePlanItem(params);
    }
  }
  
  editItemEnd(event: any): void {
    this.data.fieldBeingEdited = "";
  }

  editItemStart(field: string): void {
    this.data.fieldBeingEdited = field;
    this.data.itemBeingEdited = (this.item?.id as number);
    if (field == 'startTime') {
      this.data.editValueFirst = '00';
      this.data.editValueSecond = '00';
      if (this.item?.startTime.length && this.item?.startTime.indexOf(":") > 0) {
        this.data.editValueFirst = ((this.item as DTPlanItem).startTime as string).split(':')[0];
        this.data.editValueSecond = ((this.item as DTPlanItem).startTime as string).split(':')[1];  
      }
    }
    if (field == 'title') {
      this.data.editValueFirst = (this.item as DTPlanItem).title;
      this.data.editValueSecond = (this.item?.note as string);
    }    
  }

  getPlanItemOrRecurrenceItem(itemId: number): DTPlanItem | undefined {
    let itm = this.dtPlanner.planItems.find(x => x.id == itemId);
    if (itm == undefined) itm = this.dtPlanner.recurrenceItems.find(x => x.id == itemId);
    return itm;
  }

  ngOnInit(): void {
    this.dtPlanner.componentMethodCalled$.subscribe((msg) => {
      this.processPlannerServiceResult(msg);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.processPlannerServiceResult("");
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

  processPlannerServiceResult(msg: string): void {         
  }

  tooltipFormatted(s:string | undefined): string {    
    let result = s?.replaceAll("\n", "<br />\n");
    return (result as string);
  }

  test() {
    console.log (this.category, this.item);
  }
}
