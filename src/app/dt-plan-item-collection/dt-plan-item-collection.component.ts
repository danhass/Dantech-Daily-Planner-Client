import { Component, OnInit, Input } from '@angular/core';
import { DTPlanItem } from '../services/dt-constants.service';
import { DtData } from '../services/dt-data-store.service';
import { DtPlannerService } from '../services/dt-planner.service';

@Component({
  selector: 'app-dt-plan-item-collection',
  templateUrl: './dt-plan-item-collection.component.html',
  styleUrls: ['./dt-plan-item-collection.component.less']
})
export class DtPlanItemCollectionComponent implements OnInit {
  @Input() data: DtData | any;
  @Input() category: string | any;  
  items: Array<DTPlanItem> = [];

  constructor(
    private dtPlanner: DtPlannerService
  ) {  
  }

  ngOnInit(): void {
    this.processPlannerServiceResult("");
    this.dtPlanner.componentMethodCalled$.subscribe((msg: string) => {
      this.processPlannerServiceResult(msg);
    });
  }

  processPlannerServiceResult(msg: string): void {
    this.items = []; 
    if (this.category == "Project Recurrences") {
      for (let i = 0; i<this.dtPlanner.projectItems.length; i++) {
        if ((this.dtPlanner?.projectItems[i]?.recurrence as Number) > 0) {
          this.items.push(this.dtPlanner.projectItems[i]);
        }
      }
    }

    if(this.category == "Project Plan Items"){
      for (let i=0; i<this.dtPlanner.projectItems.length; i++) {
        if (this.dtPlanner.projectItems[i].recurrence == null) {
          this.items.push(this.dtPlanner.projectItems[i]);
        }
      }
    }
  }
}
