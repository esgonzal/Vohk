import { Component } from '@angular/core';
import { EkeyServiceService } from '../services/ekey-service.service';
import { EkeyFormulario } from '../Ekey';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ekey',
  templateUrl: './ekey.component.html',
  styleUrls: ['./ekey.component.css']
})
export class EkeyComponent {

  constructor(private router: Router, public ekeyService: EkeyServiceService){}

  //VARIABLES QUE RECIBEN LOS VALORES DE LOS FORMULARIOS//
  keyName: string;
  remoteEnable:string;
  recieverName:string;
  ekeyStartTime:string;
  ekeyEndTime:string;
  ////

  async cambiarNombre(datos:EkeyFormulario){
    await this.ekeyService.modifyEkey(datos.keyName);
    this.ekeyService.cambiarNombre = false;
    const username = localStorage.getItem('user')
    this.router.navigate(['/users', username]);
  }

  

  
}
