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

  async validarNuevaEkey(datos: Formulario){
    if (datos.ekeyType==='1'){//PERMANENTE
      await this.ekeyService.sendEkey(this.ekeyService.token, this.ekeyService.lockID, datos.recieverName, datos.name, "0", "0");
      this.router.navigate(["lock", this.ekeyService.lockID]);
    }
    else if(datos.ekeyType==='2'){//PERIODICA
      let startDate = moment(datos.startDate).format("YYYY-MM-DD");
      let endDate = moment(datos.endDate).format("YYYY-MM-DD");
      let fechaInicial = startDate.concat('-').concat(datos.startHour);
      let fechaFinal = endDate.concat('-').concat(datos.endHour);
      await this.ekeyService.sendEkey(this.ekeyService.token, this.ekeyService.lockID, datos.recieverName, datos.name, this.lockService.convertirDate(fechaInicial), this.lockService.convertirDate(fechaFinal));
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
      let newEndDate = moment(newStartDay).add(this.transformarHora(datos.endHour), "milliseconds").valueOf()
      const selectedDayNumbers: number[] = [];
      this.weekDays.forEach(day => {
        if (day.checked) {selectedDayNumbers.push(day.value)}});
      await this.ekeyService.sendEkey(this.ekeyService.token, this.ekeyService.lockID, datos.recieverName, datos.name, newStartDate.toString(), newEndDate.toString(), 4, newStartDay.toString(), newEndDay.toString(), JSON.stringify(selectedDayNumbers))
      this.router.navigate(["lock", this.ekeyService.lockID]);
    }
  }
}
