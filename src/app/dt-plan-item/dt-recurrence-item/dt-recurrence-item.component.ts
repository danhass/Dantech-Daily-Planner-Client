import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DtPlannerService } from '../../services/dt-planner.service';
import { DtData} from '../../services/dt-data-store.service';
import { DTPlanItem, DTEmptyPlanItem } from '../../services/dt-constants.service';

@Component({
  selector: 'app-dt-recurrence-item',
  templateUrl: './dt-recurrence-item.component.html',
  styleUrls: ['./dt-recurrence-item.component.less']
})
export class DtRecurrenceItemComponent implements OnInit, OnChanges {
  @Input() item: DTPlanItem = new DTEmptyPlanItem();

  constructor(
    public dtPlanner: DtPlannerService,
    public data: DtData
  ) { 
    this.processPlannerServiceResult("");
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
