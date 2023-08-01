import { Component } from '@angular/core';

@Component({
  selector: 'app-ekey',
  templateUrl: './ekey.component.html',
  styleUrls: ['./ekey.component.css']
})
export class EkeyComponent {

  
  keyName: string;
  remoteEnable:string;
  recieverName:string;
  ekeyStartTime:string;
  ekeyEndTime:string;

  displayModificar: boolean =false
  toggleModificar(){this.displayModificar = !this.displayModificar}
  displayEditarPeriodo: boolean=false
  toggleEditarPeriodo(){this.displayEditarPeriodo = !this.displayEditarPeriodo}
  displaySend: boolean =false;
  toggleSend(){this.displaySend = !this.displaySend}
  displayAuth: boolean=false
  toggleAuth(){this.displayAuth = !this.displayAuth}

  constructor(){}

  
}
