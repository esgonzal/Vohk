import { Component } from '@angular/core';
import { EkeyServiceService } from '../services/ekey-service.service';
import { Router } from '@angular/router';
import { Formulario } from '../Interfaces/Formulario';
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

  weekDays = [
    { name: 'Lunes', value: 2, checked: false },
    { name: 'Martes', value: 3, checked: false },
    { name: 'Miercoles', value: 4, checked: false },
    { name: 'Jueves', value: 5, checked: false },
    { name: 'Viernes', value: 6, checked: false },
    { name: 'Sabado', value: 7, checked: false },
    { name: 'Domingo', value: 1, checked: false }
  ];
  onCheckboxChange(event: any, day: any) {
    day.checked = event.target.checked;
  }
  transformarHora(Tiempo: string) {
    let tiempoHora = Tiempo.split(":")[0]
    let tiempoMinuto = Tiempo.split(":")[1]
    return ((Number(tiempoHora) * 60 + Number(tiempoMinuto))*60000).toString()
  }

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
      await this.ekeyService.sendEkey(this.ekeyService.token, this.ekeyService.lockID, datos.recieverName, datos.name, this.ekeyService.convertirDate(fechaInicial), this.ekeyService.convertirDate(fechaFinal));
      this.router.navigate(["lock", this.ekeyService.lockID]);
    }
    else if(datos.ekeyType==='3'){
      await this.ekeyService.sendEkey(this.ekeyService.token, this.ekeyService.lockID, datos.recieverName, datos.name, moment().toString(), "1");
      this.router.navigate(["lock", this.ekeyService.lockID]);
    }
    else if(datos.ekeyType==='4'){
      let newStartDay = moment(datos.startDate).valueOf()
      let newEndDay = moment(datos.endDate).valueOf()
      let newStartDate = moment(newStartDay).add(this.transformarHora(datos.startHour), "milliseconds").valueOf()
      let newEndDate = moment(newStartDay).add(this.transformarHora(datos.endHour), "milliseconds").valueOf()
      const selectedDayNumbers: number[] = [];
      this.weekDays.forEach(day => {
        if (day.checked) {
          selectedDayNumbers.push(day.value);
        }
      });
      //console.log("dias seleccionados: ",JSON.stringify(selectedDayNumbers))
      console.log("startDate => startDay (solo importa el dia): ",moment(newStartDay).format("YYYY-MM-DD HH:mm"), " / ", newStartDay)
      console.log("endDate => endDay (solo importa el dia): ",moment(newEndDay).format("YYYY-MM-DD HH:mm"), " / ", newEndDay)
      console.log("startHour => startDate (solo importa la hora): ",moment(newStartDate).format("YYYY-MM-DD HH:mm"), " / ", newStartDate)
      console.log("endHour => endDate (solo importa la hora): ",moment(newEndDate).format("YYYY-MM-DD HH:mm"), " / ", newEndDate)
      await this.ekeyService.sendEkey(this.ekeyService.token, this.ekeyService.lockID, datos.recieverName, datos.name, newStartDate.toString(), newEndDate.toString(), 4, newStartDay.toString(), newEndDay.toString(), JSON.stringify(selectedDayNumbers))
      this.router.navigate(["lock", this.ekeyService.lockID]);
    }
  }

  

  
}
