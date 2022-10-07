import { Component, Input, OnInit } from '@angular/core';
import { DtData } from '../services/dt-data-store.service';
import { DTPlanItem, DTProject } from '../services/dt-constants.service';
import { DtPlannerService} from '../services/dt-planner.service';

@Component({
  selector: 'app-dt-project',
  templateUrl: './dt-project.component.html',
  styleUrls: ['./dt-project.component.less']
})
export class DtProjectComponent implements OnInit {
 
  constructor(
    public dtPlanner: DtPlannerService,
    public data: DtData
  ) { }
  
  ngOnInit(): void {
    this.dtPlanner.componentMethodCalled$.subscribe((msg: string) => {
      this.processPlannerServiceResult(msg);
    });
  }

  deleteProject(project: DTProject | undefined): void {
    let p = (project as DTProject);
    let proceed = confirm("Are you sure you wannt delete " + p.title);
    if (proceed) {
      this.dtPlanner.deleteProject(p.id, this.data.projectDeleteProjItems, this.data.projectTransferItemsTo);
      this.data.targetProject = undefined;
    }
  }

  editItemStart(itemId: number | undefined, field: string): void {
    if (itemId == undefined) return;
    let itm = (this.dtPlanner.planItems as Array<DTPlanItem>).find(x => x.id == itemId);
    let proj = undefined;
    if (itm == undefined) itm = (this.dtPlanner.recurrenceItems as Array<DTPlanItem>).find(x => x.id == itemId);
    if (field == 'project-description') proj = (this.dtPlanner.projects as Array<DTProject>).find(x => x.id == itemId);
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

  filteredProjects(): Array<DTProject> {
    return this.dtPlanner.projects.filter(x => x.id != this.data.projectBeingDeleted);
  }

  processPlannerServiceResult(msg: string) {
    this.data.projectBeingDeleted = 0;
    this.data.projectDeleteProjItems = true;
    this.data.projectTransferItemsTo = 0;
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
