import { Component } from '@angular/core';

@Component({
  selector: 'app-iccard',
  templateUrl: './iccard.component.html',
  styleUrls: ['./iccard.component.css']
})
export class ICCardComponent {
  
  cardName:string;
  cardStartTime: string;
  cardEndTime: string;
  
  displayEditarNombre = false;
  toggleEditarNombre(){this.displayEditarNombre = !this.displayEditarNombre;}
  displayInfo:boolean=false
  toggleInfo(){this.displayInfo = !this.displayInfo}
  displayEditarPeriodo = false
  toggleEditarPeriodo(){this.displayEditarPeriodo = !this.displayEditarPeriodo}

  constructor(){}
}