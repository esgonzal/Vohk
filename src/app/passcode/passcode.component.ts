import { Component } from '@angular/core';
import { Formulario } from '../Formulario';
import { PasscodeServiceService } from '../services/passcode-service.service';
import { Router } from '@angular/router';
import moment from 'moment';



@Component({
  selector: 'app-passcode',
  templateUrl: './passcode.component.html',
  styleUrls: ['./passcode.component.css'],
})
export class PasscodeComponent {
  
  selectedType = '';
  onSelected(value: string): void {this.selectedType = value}
  
  constructor(private passcodeService: PasscodeServiceService, private router: Router) { }

  async validarNuevaPass(datos: Formulario){
    let fechaInicial:string = '';
    let fechaFinal:string = '';
    if(datos.startDate){
      const startDate = moment(datos.startDate).format("YYYY-MM-DD");
      const endDate = moment(datos.endDate).format("YYYY-MM-DD");
      fechaInicial = startDate.concat('-').concat(datos.startHour);
      fechaFinal = endDate.concat('-').concat(datos.endHour);
    } else {
      fechaInicial = datos.startHour;
      fechaFinal = datos.endHour;
    }
    if (datos.passcodePwd){//ES CUSTOM PASSWORD
      await this.passcodeService.generateCustomPasscode(this.passcodeService.token, this.passcodeService.lockID, datos.passcodePwd, datos.name, datos.passcodeType, fechaInicial, fechaFinal);
      this.router.navigate(["lock", this.passcodeService.lockID]);
    } else {//ES RANDOM PASSWORD
      await this.passcodeService.generatePasscode(this.passcodeService.token, this.passcodeService.lockID, datos.passcodeType, datos.name, fechaInicial, fechaFinal);
      this.router.navigate(["lock", this.passcodeService.lockID]);
    }
  }

}
