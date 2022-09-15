import { Component, Input, OnInit } from '@angular/core';
import { DtData } from '../dt-data-store.service';

@Component({
  selector: 'app-dt-not-mobile-planner',
  templateUrl: './dt-not-mobile-planner.component.html',
  styleUrls: ['./dt-not-mobile-planner.component.less']
})
export class DtNotMobilePlannerComponent implements OnInit {
  @Input() data: DtData | any;

  constructor() { }

  ngOnInit(): void {
  }

}
