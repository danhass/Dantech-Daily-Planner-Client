import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-dt-keto',
  templateUrl: './dt-keto.component.html',
  styleUrls: ['./dt-keto.component.less']
})
export class DtKetoComponent implements OnInit {
  ketoFatGrams: number = 0;
  ketoProteinGrams: number = 0;
  ketoCarbGrams: number = 0;
  ketoFiberGrams: number = 0
  isKeto: boolean = false;
  isKetoHiPro: boolean = false;

  ngOnInit(): void {
    this.calcKeto();
  }
  
  calcKeto(): void {
    console.log ("fired");
    let totalCal = this.ketoFatGrams * 9 + this.ketoCarbGrams * 4 + this.ketoProteinGrams * 4;    
    this.isKeto = (totalCal == 0 || ((this.ketoCarbGrams - this.ketoFiberGrams) * 4)/totalCal <= .1 && (this.ketoProteinGrams * 4)/totalCal <= .2);
    this.isKetoHiPro = (totalCal == 0 || (((this.ketoCarbGrams - this.ketoFiberGrams) * 4)/totalCal <= .05 && (this.ketoProteinGrams * 4)/totalCal <= .35));
  }
} 
