import { Component, ViewChild } from '@angular/core';
import { Formulario } from '../Formulario';
import { PasscodeServiceService } from '../services/passcode-service.service';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import moment from 'moment';



@Component({
  selector: 'app-passcode',
  templateUrl: './passcode.component.html',
  styleUrls: ['./passcode.component.css'],
  
})
export class PasscodeComponent {
  
  selectedType = '';
  onSelected(value: string): void {this.selectedType = value}

  public convertirDate(date:string){
    //date= '2023-07-19-09'
    //No es necesario ajustar la hora con shanghai, solo pon tu hora local
    let fechaInShanghai = moment(date, "YYYY-MM-DD-HH:mm").valueOf();
    if(Number.isNaN(fechaInShanghai)){
      return date
    }
    return fechaInShanghai.toString();
  }
  
  constructor(private passcodeService: PasscodeServiceService, private router: Router) { }


  async validarNuevaPass(datos: Formulario){
    const startDate = moment(datos.startDate).format("YYYY-MM-DD");
    const endDate = moment(datos.endDate).format("YYYY-MM-DD");
    const fechaInicial = startDate.concat('-').concat(datos.startHour);
    const fechaFinal = endDate.concat('-').concat(datos.endHour);
    if (datos.passcodePwd){//ES CUSTOM PASSWORD
      await this.passcodeService.generateCustomPasscode(this.passcodeService.token, this.passcodeService.lockID, datos.passcodePwd, datos.name, datos.passcodeType, fechaInicial, fechaFinal);
      this.router.navigate(["lock", this.passcodeService.lockID]);
    } else {//ES RANDOM PASSWORD
      await this.passcodeService.generatePasscode(this.passcodeService.token, this.passcodeService.lockID, datos.passcodeType, datos.name, fechaInicial, fechaFinal);
      this.router.navigate(["lock", this.passcodeService.lockID]);
    }
  }

}
