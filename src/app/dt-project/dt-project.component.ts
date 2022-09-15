import { Component, Input, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { DtData } from '../dt-data-store.service';
import { ActivatedRoute, TitleStrategy } from '@angular/router';
import { dtConstants, DTLogin, DTPlanItem } from '../dt-constants.service';
import { HttpClient } from '@angular/common/http';
import { DtPlannerService} from '../dt-planner.service';
import { DtAuthService } from '../dt-auth.service';

@Component({
  selector: 'app-dt-project',
  templateUrl: './dt-project.component.html',
  styleUrls: ['./dt-project.component.less']
})
export class DtProjectComponent implements OnInit {
  @Input() data: DtData | any;

  constructor(
    private readonly dtAuth: DtAuthService,
    private route: ActivatedRoute,
    private http: HttpClient,
    public dtPlanner: DtPlannerService,
    private readonly cookies: CookieService
  ) { }
  
  ngOnInit(): void {
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

  setProjectDescription(event: any): void {
    let params: { [index: string]: any } = { sessionId: this.data.sessionId, 
                                             title: this.data.editValueFirst, 
                                             shortCode: this.data.targetProject?.shortCode, 
                                             colorCode: this.data.editValueThird, 
                                             status: 1,
                                             notes: "",
                                             id: this.data.targetProject?.id                                              
                                            }
    if (this.data.editValueSecond != null && this.data.editValueSecond != undefined && this.data.editValueSecond.length) {
      params["notes"] = this.data.editValueSecond;      
    }    
    this.dtPlanner.addProject(params);
    this.data.itemBeingEdited = 0;
    this.data.fieldBeingEdited = '';
    this.data.editValueFirst = '';
    this.data.editValueSecond = "";
    this.data.editValueThird = "";
  }

}
