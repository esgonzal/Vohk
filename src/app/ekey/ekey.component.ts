import { Component } from '@angular/core';
import { EkeyServiceService } from '../services/ekey-service.service';
import { Router } from '@angular/router';
import { Formulario } from '../Formulario';
import moment from 'moment';

@Component({
  selector: 'app-ekey',
  templateUrl: './ekey.component.html',
  styleUrls: ['./ekey.component.css']
})
export class EkeyComponent {

  selectedType = '';
  onSelected(value: string): void {this.selectedType = value}

  constructor(private router: Router, public ekeyService: EkeyServiceService){}

  async validarNuevaEkey(datos: Formulario){
    const startDate = moment(datos.startDate).format("YYYY-MM-DD");
    const endDate = moment(datos.endDate).format("YYYY-MM-DD");
    const fechaInicial = startDate.concat('-').concat(datos.startHour);
    const fechaFinal = endDate.concat('-').concat(datos.endHour);
    if (datos.ekeyType==='1'){
      await this.ekeyService.sendEkey(this.ekeyService.token, this.ekeyService.lockID, datos.recieverName, datos.name, "0", "0");
    this.router.navigate(["lock", this.ekeyService.lockID]);
    }
    else if(datos.ekeyType==='2'){
      await this.ekeyService.sendEkey(this.ekeyService.token, this.ekeyService.lockID, datos.recieverName, datos.name, fechaInicial, fechaFinal);
      this.router.navigate(["lock", this.ekeyService.lockID]);
    }
  }

  

  
}
