import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dt-tabs',
  templateUrl: './dt-tabs.component.html',
  styleUrls: ['./dt-tabs.component.less']
})
export class DtTabsComponent implements OnInit {
  @Input() items: Array<{ [index: string]: any }> = [];

  public currentTab: string = "";

  constructor(
  ) { }

  ngOnInit(): void {  
    if (this.items.length) this.currentTab = this.items[0]['title'];
    for(let i=this.items.length; i<9; i++) this.items.push({'title': "", 'selector': null});
  }
}
