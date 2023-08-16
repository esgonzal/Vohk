import { Component } from '@angular/core';
import { EkeyServiceService } from '../services/ekey-service.service';
import { Router } from '@angular/router';
import { Formulario } from '../Interfaces/Formulario';
import moment from 'moment';
import { LockServiceService } from '../services/lock-service.service';

@Component({
  selector: 'app-ekey',
  templateUrl: './ekey.component.html',
  styleUrls: ['./ekey.component.css']
})
export class EkeyComponent {

  constructor(private lockService:LockServiceService, private router: Router, public ekeyService: EkeyServiceService){}
  username = localStorage.getItem('user') ?? ''
  lockId:number = Number(localStorage.getItem('lockID') ?? '')
  error = "";
  selectedType = '';
  weekDays = [
    { name: 'Lunes', value: 2, checked: false },
    { name: 'Martes', value: 3, checked: false },
    { name: 'Miercoles', value: 4, checked: false },
    { name: 'Jueves', value: 5, checked: false },
    { name: 'Viernes', value: 6, checked: false },
    { name: 'Sabado', value: 7, checked: false },
    { name: 'Domingo', value: 1, checked: false }
  ];

  onSelected(value: string): void {this.selectedType = value}

  onCheckboxChange(event: any, day: any) {day.checked = event.target.checked}

  transformarHora(Tiempo: string) {
    let tiempoHora = Tiempo.split(":")[0]
    let tiempoMinuto = Tiempo.split(":")[1]
    return ((Number(tiempoHora) * 60 + Number(tiempoMinuto))*60000).toString()
  }

  validaFechaUsuario(diaFinal:string, horaFinal:string):boolean{
    if (this.ekeyService.endDateDeUser === "0"){
      return true
    }
    else {
      if(diaFinal === undefined){
        console.log("Un usuario temporal no puede crear ekeys permanentes")
        return false;
      }
      else {
        let unixTimestamp = parseInt(this.ekeyService.endDateDeUser);
        let endUser = moment.unix(unixTimestamp / 1000);
        let endDate = moment(diaFinal).add(this.transformarHora(horaFinal), "milliseconds")
        if( endUser.isAfter(endDate)){
          return true
        }
        else{
          console.log("El usuario termina antes que la ekey, por lo que no se puede")
          return false;
        }
      }
    }
  }

  async crearEkey(datos: Formulario){
    if (datos.ekeyType==='1'){//PERMANENTE
      await this.ekeyService.sendEkey(this.ekeyService.token, this.ekeyService.lockID, datos.recieverName, datos.name, "0", "0");
      this.router.navigate(["lock", this.ekeyService.lockID]);
    }
    else if(datos.ekeyType==='2'){//PERIODICA
      let newStartDay = moment(datos.startDate).valueOf()
      let newEndDay = moment(datos.endDate).valueOf()
      let newStartDate = moment(newStartDay).add(this.transformarHora(datos.startHour), "milliseconds").valueOf()
      let newEndDate = moment(newEndDay).add(this.transformarHora(datos.endHour), "milliseconds").valueOf()
      await this.ekeyService.sendEkey(this.ekeyService.token, this.ekeyService.lockID, datos.recieverName, datos.name, newStartDate.toString(), newEndDate.toString());
      this.router.navigate(["lock", this.ekeyService.lockID]);
    }
    else if(datos.ekeyType==='3'){//DE UN USO
      await this.ekeyService.sendEkey(this.ekeyService.token, this.ekeyService.lockID, datos.recieverName, datos.name, moment().valueOf().toString(), "1");
      this.router.navigate(["lock", this.ekeyService.lockID]);
    }
    else if(datos.ekeyType==='4'){//SOLICITANTE
      let newStartDay = moment(datos.startDate).valueOf()
      let newEndDay = moment(datos.endDate).valueOf()
      let newStartDate = moment(newStartDay).add(this.transformarHora(datos.startHour), "milliseconds").valueOf()
      let newEndDate = moment(newEndDay).add(this.transformarHora(datos.endHour), "milliseconds").valueOf()
      const selectedDayNumbers: number[] = [];
      this.weekDays.forEach(day => {
        if (day.checked) {selectedDayNumbers.push(day.value)}});
      await this.ekeyService.sendEkey(this.ekeyService.token, this.ekeyService.lockID, datos.recieverName, datos.name, newStartDate.toString(), newEndDate.toString(), 4, newStartDay.toString(), newEndDay.toString(), JSON.stringify(selectedDayNumbers))
      this.router.navigate(["users",this.username,"lock", this.lockId]);
    }
  }

  async validarNuevaEkey(datos: Formulario){
    this.error = '';
    if(!datos.recieverName){
      this.error = "Por favor llene el campo 'Nombre del Recipiente'"
    }
    else {
      if(!datos.ekeyType){
        this.error = "Por favor elija un tipo de eKey"
      }
      else {
        if (this.validaFechaUsuario(datos.endDate, datos.endHour)){
          this.crearEkey(datos);
        }
        else {
          this.error = "La eKey no puede durar más que el creador"
        }
      }
    }
  }
}
