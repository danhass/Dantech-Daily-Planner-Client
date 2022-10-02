import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DtPlannerService } from '../../services/dt-planner.service';
import { DtData} from '../../services/dt-data-store.service';
import { DTPlanItem } from '../../services/dt-constants.service';

@Component({
  selector: 'app-dt-recurrence-item',
  templateUrl: './dt-recurrence-item.component.html',
  styleUrls: ['./dt-recurrence-item.component.less']
})
export class DtRecurrenceItemComponent implements OnInit, OnChanges {
  @Input() item: DTPlanItem | undefined;

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
      let params = this.dtPlanner.planItemParams(itm.id);
      params["title"] = this.data.editValueFirst;
      params["note"] = (this.data.editValueSecond == null || this.data.editValueSecond == 'null') ? null : this.data.editValueSecond;
      this.dtPlanner.updatePlanItem(params);
    }
  }

  deleteRecurrence(item: DTPlanItem | undefined) {
    if (item == undefined) return;
    let delChildren = (confirm('Delete child items of ' + item.title + ', too?'));
    let proceed = confirm('Delete ' + item.title + "?");
    if (proceed) {
      this.data.updateStatus = "Deleting...";
      this.dtPlanner.deleteRecurrence(item.id, delChildren);
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

  processPlannerServiceResult(msg: string): void {         
  }

}
