import { Component } from '@angular/core';
import { Formulario } from '../Interfaces/Formulario';
import { PasscodeServiceService } from '../services/passcode-service.service';
import { Router } from '@angular/router';
import moment from 'moment';
import { LockServiceService } from '../services/lock-service.service';

@Component({
  selector: 'app-passcode',
  templateUrl: './passcode.component.html',
  styleUrls: ['./passcode.component.css'],
})
export class PasscodeComponent {

  constructor(private passcodeService: PasscodeServiceService, private lockService: LockServiceService, private router: Router) { }
  
  selectedType = '';
  onSelected(value: string): void {this.selectedType = value}
  
  async validarNuevaPass(datos: Formulario){
    let startDate = moment(datos.startDate).format("YYYY-MM-DD");
    let endDate = moment(datos.endDate).format("YYYY-MM-DD");
    let fechaInicial = startDate.concat('-').concat(datos.startHour);
    let fechaFinal = endDate.concat('-').concat(datos.endHour);
    if(datos.passcodePwd){//CUSTOM PASSCODE
      if(datos.startDate){//CUSTOM PERIOD
        await this.passcodeService.generateCustomPasscode(this.passcodeService.token, this.passcodeService.lockID, datos.passcodePwd, "3", datos.name, this.lockService.convertirDate(fechaInicial), this.lockService.convertirDate(fechaFinal));
        this.router.navigate(["lock", this.passcodeService.lockID]);
      } 
      else {//CUSTOM PERMANENT
        await this.passcodeService.generateCustomPasscode(this.passcodeService.token, this.passcodeService.lockID, datos.passcodePwd, "2", datos.name, "0", "0");
        this.router.navigate(["lock", this.passcodeService.lockID]);
      }
    } 
    else {//NORMAL PASSCODE
      if(datos.startDate){//PERIODICA
        await this.passcodeService.generatePasscode(this.passcodeService.token, this.passcodeService.lockID, datos.passcodeType, this.lockService.convertirDate(fechaInicial), datos.name, this.lockService.convertirDate(fechaFinal));
        this.router.navigate(["lock", this.passcodeService.lockID]);
      }
      else {//RECURRENTE O PERMANENTE
        if (datos.startHour){//RECURRENTE
          await this.passcodeService.generatePasscode(this.passcodeService.token, this.passcodeService.lockID, datos.passcodeType,this.lockService.convertirDate(datos.startHour), datos.name, this.lockService.convertirDate(datos.endHour));
          this.router.navigate(["lock", this.passcodeService.lockID]);
        }
        else {//PERMANENTE
          console.log(moment().valueOf())
          await this.passcodeService.generatePasscode(this.passcodeService.token, this.passcodeService.lockID, datos.passcodeType, moment().valueOf().toString(), datos.name)
          this.router.navigate(["lock", this.passcodeService.lockID]);
        }
      }
    }
  }
}

