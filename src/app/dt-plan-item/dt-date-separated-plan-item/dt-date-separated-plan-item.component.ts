import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DtPlannerService } from '../../services/dt-planner.service';
import { DtData} from '../../services/dt-data-store.service';
import { DTPlanItem } from '../../services/dt-constants.service';

@Component({
  selector: 'app-dt-date-separated-plan-item',
  templateUrl: './dt-date-separated-plan-item.component.html',
  styleUrls: ['./dt-date-separated-plan-item.component.less']
})
export class DtDateSeparatedPlanItemComponent implements OnInit, OnChanges {
  @Input() item: DTPlanItem | undefined;

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
