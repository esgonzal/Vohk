import { Component } from '@angular/core';
import { Router } from '@angular/router';
import moment from 'moment';
import { Formulario } from '../Interfaces/Formulario';
import { EkeyServiceService } from '../services/ekey-service.service';
import { RecipientList } from '../Interfaces/RecipientList';
import { PopUpService } from '../services/pop-up.service';

@Component({
  selector: 'app-multiple-ekey',
  templateUrl: './multiple-ekey.component.html',
  styleUrls: ['./multiple-ekey.component.css']
})
export class MultipleEkeyComponent {

  constructor(private router: Router, public ekeyService: EkeyServiceService, public popupService: PopUpService) { }

  username = localStorage.getItem('user') ?? ''
  lockId: number = Number(localStorage.getItem('lockID') ?? '')
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
  selectedLocks: number[] = []//Add the lockIds of selected locks
  recipientes: RecipientList[] = []//Add the name and ekeyName to be sent for every lock in selectedLocks

  onSelected(value: string): void { 
    this.selectedType = value 
  }
  onCheckboxChange(event: any, day: any) { 
    day.checked = event.target.checked 
  }
  transformarHora(Tiempo: string) {
    let tiempoHora = Tiempo.split(":")[0]
    let tiempoMinuto = Tiempo.split(":")[1]
    return ((Number(tiempoHora) * 60 + Number(tiempoMinuto)) * 60000).toString()
  }
  validaFechaUsuario(diaFinal: string, horaFinal: string, tipo: string): boolean {
    if (this.ekeyService.endDateUser !== '0') {
      if (tipo === '1' || tipo === '3') {
        this.error = "Usted como usuario con autorización temporal no puede crear una eKeys permanente"
        //La ekey es permanente
        return false
      }
      else {
        let unixTimestamp = parseInt(this.ekeyService.endDateUser);
        let endUser = moment.unix(unixTimestamp / 1000);
        let endDate = moment(diaFinal).add(this.transformarHora(horaFinal), "milliseconds")
        if (endUser.isBefore(endDate)) {
          this.error = "La eKey termina posterior a su permiso de autorización, comuníquese con el administrador de esta cerradura"
          //El usuario termina antes que la ekey
          return false;
        }
        else {
          //El usuario termina despues que la ekey
          return true
        }
      }
    }
    else {
      //El usuario es permanente
      return true;
    }
  }
  validarFechaInicio(diaInicial: string, horaInicial: string, diaFinal: string, horaFinal: string, tipo: string): boolean {
    if (tipo !== '1' && tipo !== '3') {
      let startDate = moment(diaInicial).add(this.transformarHora(horaInicial), "milliseconds")
      let endDate = moment(diaFinal).add(this.transformarHora(horaFinal), "milliseconds")
      if (endDate.isBefore(startDate)) {
        this.error = "El tiempo de inicio debe ser anterior al tiempo de finalización"
        //La ekey termina antes de la fecha de inicio
        return false;
      }
      else {
        //La ekey termina despues de la fecha de inicio
        return true;
      }
    }
    else {
      //La ekey es permanente
      return true
    }
  }
  async crearEkey(datos: Formulario, lockID:number) {
    if (datos.ekeyType === '1') {//PERMANENTE
      await this.ekeyService.sendEkey(this.ekeyService.token, lockID, datos.recieverName, datos.name, "0", "0", 1);
    }
    else if (datos.ekeyType === '2') {//PERIODICA
      let newStartDay = moment(datos.startDate).valueOf()
      let newEndDay = moment(datos.endDate).valueOf()
      let newStartDate = moment(newStartDay).add(this.transformarHora(datos.startHour), "milliseconds").valueOf()
      let newEndDate = moment(newEndDay).add(this.transformarHora(datos.endHour), "milliseconds").valueOf()
      await this.ekeyService.sendEkey(this.ekeyService.token, lockID, datos.recieverName, datos.name, newStartDate.toString(), newEndDate.toString(), 1);
    }
    else if (datos.ekeyType === '3') {//DE UN USO
      await this.ekeyService.sendEkey(this.ekeyService.token, lockID, datos.recieverName, datos.name, moment().valueOf().toString(), "1", 1);
    }
    else if (datos.ekeyType === '4') {//SOLICITANTE
      let newStartDay = moment(datos.startDate).valueOf()
      let newEndDay = moment(datos.endDate).valueOf()
      let newStartDate = moment(newStartDay).add(this.transformarHora(datos.startHour), "milliseconds").valueOf()
      let newEndDate = moment(newEndDay).add(this.transformarHora(datos.endHour), "milliseconds").valueOf()
      const selectedDayNumbers: number[] = [];
      this.weekDays.forEach(day => {
        if (day.checked) { selectedDayNumbers.push(day.value) }
      });
      await this.ekeyService.sendEkey(this.ekeyService.token, lockID, datos.recieverName, datos.name, newStartDate.toString(), newEndDate.toString(), 4, 1, newStartDay.toString(), newEndDay.toString(), JSON.stringify(selectedDayNumbers))
    }
  }
  validarNuevaEkey(datos: Formulario) {
    this.error = '';
    if (!datos.recieverName) {
      this.error = "Por favor llene el campo 'Nombre del Recipiente'"
    }
    else {
      if (!datos.ekeyType) {
        this.error = "Por favor elija un tipo de eKey"
      }
      else {
        if ((datos.ekeyType === '2' || datos.ekeyType === '4') && (!datos.startDate || !datos.endDate || !datos.startHour || !datos.endHour)) {
          this.error = "Por favor rellene los datos de fecha y/o hora"
        }
        else {
          if (this.validarFechaInicio(datos.startDate, datos.startHour, datos.endDate, datos.endHour, datos.ekeyType)) {
            if (this.validaFechaUsuario(datos.endDate, datos.endHour, datos.ekeyType)) {
              this.crearEkey(datos, this.ekeyService.lockID);
              localStorage.setItem(datos.recieverName, "1")
              this.router.navigate(["users", this.username, "lock", this.lockId]);
            }
          }
        }
      }
    }
  }
  generarMultiple(datos:Formulario){
    if(this.ekeyService.selectedLocks.length===0) {
      console.log("seleccione al menos 1 cerradura")
    }
    else if(this.ekeyService.recipients.length===0) {
      console.log("Agregue al menos 1 receptor")
    } 
    else if(this.selectedType===''){
      console.log("Elija un tipo de ekey")
    }
    else {
      console.log(this.ekeyService.selectedLocks)
      console.log(this.ekeyService.recipients)
      console.log(datos)
      for (let i = 0; i < this.ekeyService.selectedLocks.length; i++) {
        const lockId = this.ekeyService.selectedLocks[i];
        for (let j = 0; j < this.ekeyService.recipients.length; j++) {
          datos.name = this.ekeyService.recipients[j].ekeyName;
          datos.recieverName = this.ekeyService.recipients[j].username;
          this.crearEkey(datos, lockId)
          localStorage.setItem(datos.recieverName, "1")
        }
      }
      this.router.navigate(["users", this.username, "lock", this.lockId]);
    }
  }

}
