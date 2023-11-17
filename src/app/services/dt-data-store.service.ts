import { Injectable } from '@angular/core';
import { DtPlanItemCollectionComponent } from '../dt-plan-item-collection/dt-plan-item-collection.component';
import { dtConstants, DTLogin, DTProject, DTPlanItem, DTEmptyPlanItem} from './dt-constants.service';

// The point here is to expose data that can be used across all components.

@Injectable({
  providedIn: 'root'
})
export class DtData {

  public currentPlanItemDate: string = "";
  public editValueFirst: string = "";
  public editValueSecond: string = "";
  public editValueThird: string = "";
  public editValueFourth: string = "";
  public emptyPlanItem: DTPlanItem = new DTEmptyPlanItem();
  public fieldBeingEdited: string = "";
  public focusedItems: Array<number> = [];
  public isMobile: boolean = !this.notMobile();
  public itemBeingEdited: number = 0;
  public itemsRowCount: number = 0;
  public justBackFromGoogle: boolean = false;
  public login: DTLogin | null = null;
  public loginEmail: string = (this.login && this.login?.email && this.login?.email?.length) ? this.login.email : "";
  public loginComplete: boolean | undefined = undefined;
  public projectBeingDeleted: number | undefined = 0;
  public projectDeleteProjItems: boolean = true;
  public projectTransferItemsTo: number = 0;
  public projectItems: Array<DTPlanItem> = [];
  public projectVisible: boolean = false;
  public sessionId: string = "";
  public showLoginDialog: boolean = false;
  public targetPlanItem: DTPlanItem = new DTEmptyPlanItem();
  public targetProject: DTProject | undefined = undefined;
  public test: string | undefined = undefined;
  public timeStamp: string = new Date().toLocaleString();

  constructor() {    
  }

  clearPlanItem(fieldOnly: boolean) : boolean {
    this.fieldBeingEdited = "";
    if (fieldOnly) return true;
    this.itemBeingEdited = 0;
    this.targetProject = undefined;
    this.editValueFirst = '';
    this.editValueSecond = '';
    this.editValueThird = '';
    this.editValueFourth = '';
    this.targetPlanItem = this.emptyPlanItem;
    return true;  
  }

  editPlanItemEnd(event: any): boolean {
    if (event['key'] !== 'Enter') return true;
    return this.clearPlanItem(false);
  }

  editPlanItemStart(field: string, item: DTPlanItem | undefined ): void {
    this.fieldBeingEdited = field;
    let itm = (item as DTPlanItem);
    this.itemBeingEdited = (itm.id as number);
    if (field == 'startTime') {
      this.editValueFirst = '00';
      this.editValueSecond = '00';
      if (itm.startTime.length && itm.startTime.indexOf(":") > 0) {
        this.editValueFirst = (itm.startTime as string).split(':')[0];
        this.editValueSecond = (itm.startTime as string).split(':')[1];  
      }
      this.editValueThird = "";
      if (itm.fixedStart) this.editValueThird = "true";
    }
    if (field == 'duration') {
      this.editValueFirst = '00';
      this.editValueSecond = '00';
      if (itm.durationString.length && itm.durationString.indexOf(":") > 0) {
        this.editValueFirst = (itm.durationString as string).split(':')[0];
        this.editValueSecond = (itm.durationString as string).split(':')[1];  
      }
    }    
    if (field == 'title') {
      this.editValueFirst = itm.title;
      if (itm.note != undefined) this.editValueSecond = (itm.note as string);
      else this.editValueSecond = "";
      this.editValueThird = itm.priority.toString();
    } 
    if (field == 'project') {
      this.editValueFirst = (itm.project as DTProject).shortCode; 
    }
    if (field == 'day') {
      this.editValueFirst = itm.dayString;
    }
  }

  editProjectStart(field: string, project: DTProject | undefined): void {
    this.fieldBeingEdited = field;
    let proj = (project as DTProject);
    this.itemBeingEdited = proj.id;
    if (field == 'project-shortCode') {
      this.editValueFirst = proj.shortCode;
    }
    if (field == 'project-description') {
      this.editValueFirst = proj.title;
      this.editValueSecond = proj.notes;
      this.editValueThird = (proj.colorCodeId as number).toString();
      this.editValueFourth = (proj.priority as number).toString();
    }
  }
  
  focusedToggle(item: DTPlanItem): void {
    if (item && item.id) {
      const ndx = this.focusedItems.indexOf(item.id);
      if (ndx > -1) { 
        this.focusedItems = this.focusedItems.filter(x => x != item.id);
      } else this.focusedItems.push(item.id);
    }
  }

  keyUp(event: any) {
    console.log(event, this.editValueFirst);
  }

  notMobile(): boolean {
    let check = true;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = false; })(navigator.userAgent || navigator.vendor);
    //check = false; //for testing mobile layout.
    return check;
  }

  ping(): void {
    console.log("Ping");
  }

  setTargetProject(proj: DTProject | undefined): boolean {
    if (proj != undefined) this.targetProject = proj;
    return true;
  }

  toggleValueThird() {
    if (this.editValueThird && this.editValueThird === "true") this.editValueThird = "";
    else this.editValueThird = "true";
  }

  tooltipBool(b: boolean | undefined): string {
    if (b) return 'fixed';
    return '';
  }  

  tooltipFormatted(s:string | undefined): string {    
    let result = s?.replaceAll("\n", "<br />\n");
    return (result as string);
  }
  
  tooltipForTitle(item: DTPlanItem | undefined): string {
    if (item === undefined) return "";
    let sVal = "Priority: " + item.priority.toString();
    if (item.note) {
      sVal = this.tooltipFormatted(item.note) + "<br /><br />" + "Priority: " + item.priority.toString();
    }
    return sVal;
  }
}
