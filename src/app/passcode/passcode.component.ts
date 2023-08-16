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
  username = localStorage.getItem('user') ?? ''
  lockId: number = Number(localStorage.getItem('lockID') ?? '')
  error = '';
  selectedType = '';
  onSelected(value: string): void { this.selectedType = value }

  transformarHora(Tiempo: string) {
    let tiempoHora = Tiempo.split(":")[0]
    let tiempoMinuto = Tiempo.split(":")[1]
    return ((Number(tiempoHora) * 60 + Number(tiempoMinuto)) * 60000).toString()
  }

  validaFechaUsuario(diaFinal: string, horaFinal: string, tipo: string): boolean {
    if (this.passcodeService.endDateUser === "0") {//Si e user es permanente
      console.log("El usuario es permanente asi que no hay limite en las passcodes que puede hacer")
      return true
    }
    else {//Si el user no es permanente
      if (tipo !== "1" && tipo !== "2" && tipo !== "4" && tipo !== "Custom_Permanent") {//Si la clave no es permanente
        if (diaFinal === undefined) {
          console.log("Deberia ser imposible llegar aqui porque diaFinal no puede ser undefined si la clave no es permanente")
          return false;
        }
        else {
          let unixTimestamp = parseInt(this.passcodeService.endDateUser);
          let endUser = moment.unix(unixTimestamp / 1000);
          let endDate = moment(diaFinal).add(this.transformarHora(horaFinal), "milliseconds")
          if (endUser.isBefore(endDate)) {//SI el usuario termina antes que la clave
            console.log("El usuario termina antes que la clave, por lo que no se puede")
            return false;
          }
          else {//si la clave termina antes que el usuario
            console.log("La clave termina antes que el usuario por lo que si es posible crearla")
            return true
          }
        }
      }
      else {//Si la clave es permanente
        console.log("Un usuario temporal no puede crear una clave permanente")
        return false
      }
    }
  }

  validaFechaInicio(diaInicial: string, horaInicial: string, diaFinal: string, horaFinal: string, tipo: string): boolean {
    if (tipo !== "1" && tipo !== "2" && tipo !== "4" && tipo !== "Custom_Permanent") {//Si la clave no es permanente){
      let startDate = moment(diaInicial).add(this.transformarHora(horaInicial), "milliseconds")
      if (startDate.add(24, 'hours').isBefore(moment())) {//Si la clave inicia antes que el momento presente
        this.error = "La passcode no puede inciar 24 horas antes que ahora"
        return false;
      }
      else {
        let endDate = moment(diaFinal).add(this.transformarHora(horaFinal), "milliseconds")
        if (endDate.isBefore(startDate)) {//Si la clave termina antes de que empieza
          this.error = "El tiempo de inicio debe ser anterior al tiempo de finalización"
          return false;
        }
        else {
          return true;
        }
      }
    }
    else {
      return true;
    }
  }

  async crearpasscode(datos: Formulario) {
    let startDate = moment(datos.startDate).format("YYYY-MM-DD");
    let endDate = moment(datos.endDate).format("YYYY-MM-DD");
    let fechaInicial = startDate.concat('-').concat(datos.startHour);
    let fechaFinal = endDate.concat('-').concat(datos.endHour);
    if (datos.passcodePwd) {//CUSTOM PASSCODE
      if (datos.startDate) {//CUSTOM PERIOD
        await this.passcodeService.generateCustomPasscode(this.passcodeService.token, this.passcodeService.lockID, datos.passcodePwd, "3", datos.name, this.lockService.convertirDate(fechaInicial), this.lockService.convertirDate(fechaFinal));
        this.router.navigate(["users",this.username,"lock", this.lockId]);
      }
      else {//CUSTOM PERMANENT
        await this.passcodeService.generateCustomPasscode(this.passcodeService.token, this.passcodeService.lockID, datos.passcodePwd, "2", datos.name, "0", "0");
        this.router.navigate(["users",this.username,"lock", this.lockId]);
      }
    }
    else {//NORMAL PASSCODE
      if (datos.startDate) {//PERIODICA
        await this.passcodeService.generatePasscode(this.passcodeService.token, this.passcodeService.lockID, datos.passcodeType, this.lockService.convertirDate(fechaInicial), datos.name, this.lockService.convertirDate(fechaFinal));
        this.router.navigate(["users",this.username,"lock", this.lockId]);
      }
      else {//RECURRENTE O PERMANENTE
        if (datos.startHour) {//RECURRENTE
          await this.passcodeService.generatePasscode(this.passcodeService.token, this.passcodeService.lockID, datos.passcodeType, this.lockService.convertirDate(datos.startHour), datos.name, this.lockService.convertirDate(datos.endHour));
          this.router.navigate(["users",this.username,"lock", this.lockId]);
        }
        else {//PERMANENTE
          console.log(moment().valueOf())
          await this.passcodeService.generatePasscode(this.passcodeService.token, this.passcodeService.lockID, datos.passcodeType, moment().valueOf().toString(), datos.name)
          this.router.navigate(["users",this.username,"lock", this.lockId]);
        }
      }
    }
  }

  validarNuevaPass(datos: Formulario) {
    this.error = '';
    if (!datos.passcodeType) {
      this.error = "Por favor elija un tipo de passcode"
    }
    else {
      if( ((datos.passcodeType==='3' || datos.passcodeType==='Custom_Period') && (!datos.startDate || !datos.endDate || !datos.startHour || !datos.endHour)) ){
        this.error = "Por favore rellene los datos de fecha y hora"
      }
      else {
        if (!this.validaFechaInicio(datos.startDate, datos.startHour, datos.endDate, datos.endHour, datos.passcodeType)) {
          //this.error = "La passcode no puede inciar 24 horas antes que ahora"
        }
        else {
          if (!this.validaFechaUsuario(datos.endDate, datos.endHour, datos.passcodeType)) {
            //this.error = "La passcode no puede durar más que el creador"
          }
          else {
            this.crearpasscode(datos);
          }
        }
      }



      
    }
  }
}

