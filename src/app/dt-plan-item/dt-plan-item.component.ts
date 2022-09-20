import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DtPlannerService } from '../services/dt-planner.service';
import { DTPlanItem } from '../services/dt-constants.service';

@Component({
  selector: 'app-dt-plan-item',
  templateUrl: './dt-plan-item.component.html',
  styleUrls: ['./dt-plan-item.component.less']
})
export class DtPlanItemComponent implements OnInit, OnChanges {
  @Input() id: number = 0;
  @Input() category: string = "";

  public item: DTPlanItem | undefined;

  constructor(
    public dtPlanner: DtPlannerService
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
    this.item = this.dtPlanner.projectItems.find(x => x.id == this.id);
  }

}
