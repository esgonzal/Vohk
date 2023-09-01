import { Component } from '@angular/core';
import { EkeyServiceService } from '../services/ekey-service.service';
import { Router } from '@angular/router';
import { Formulario } from '../Interfaces/Formulario';
import moment from 'moment';
import emailjs from 'emailjs-com';
import { sendEkeyResponse } from '../Interfaces/Elements';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-ekey',
  templateUrl: './ekey.component.html',
  styleUrls: ['./ekey.component.css']
})
export class EkeyComponent {

  constructor(private router: Router, public ekeyService: EkeyServiceService) { }
  username = localStorage.getItem('user') ?? ''
  lockId: number = Number(localStorage.getItem('lockID') ?? '')
  lockAlias = localStorage.getItem('Alias') ?? ''
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

  toMultipleEkeys() {
    this.router.navigate(['users', this.username, 'lock', this.lockId, 'ekey', 'multiple'])
  }
  onSelected(value: string): void {
    this.selectedType = value
  }
  onCheckboxChange(event: any, day: any) {
    day.checked = event.target.checked
  }
  transformarHora(Tiempo: string) {//Esta funcion está encargada de convertir el resultado del timepicker, un string de formato ("HH:mm"), en un number que representa el tiempo en milisegundos
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
  async crearEkey(datos: Formulario) {
    if (datos.ekeyType === '1') {//PERMANENTE
      const response = await lastValueFrom(this.ekeyService.sendEkey(this.ekeyService.token, this.ekeyService.lockID, datos.recieverName, datos.name, "0", "0", 1));
      const typedResponse = response as sendEkeyResponse;
      if (typedResponse.errcode === 0) {
        if (this.isValidEmail(datos.recieverName)) {//La cuenta es un correo electronico
          this.sendEmail_permanentEkey(datos.recieverName, datos.name);
        } else {//La cuenta es un numero de celular
          console.log("No es un correo, por lo tanto deberia ser un numero. Mandar mensaje de texto en vez de correo")
        }
      } else {
        console.log("error:",typedResponse);
      }
    }
    else if (datos.ekeyType === '2') {//PERIODICA
      let newStartDay = moment(datos.startDate).valueOf()
      let newEndDay = moment(datos.endDate).valueOf()
      let newStartDate = moment(newStartDay).add(this.transformarHora(datos.startHour), "milliseconds").valueOf()
      let newEndDate = moment(newEndDay).add(this.transformarHora(datos.endHour), "milliseconds").valueOf()
      const response = await lastValueFrom(this.ekeyService.sendEkey(this.ekeyService.token, this.ekeyService.lockID, datos.recieverName, datos.name, newStartDate.toString(), newEndDate.toString(), 1));
      const typedResponse = response as sendEkeyResponse;
      if (typedResponse.errcode === 0) {
        if (this.isValidEmail(datos.recieverName)) {
          this.sendEmail_periodicEkey(datos.recieverName, datos.name, moment(newStartDate).format("YYYY/MM/DD HH:mm"), moment(newEndDate).format("YYYY/MM/DD HH:mm"));
        } else {
          console.log("No es un correo, por lo tanto deberia ser un numero. Mandar mensaje de texto en vez de correo")
        }
      } else {
        console.log("error:",typedResponse);
      }
    }
    else if (datos.ekeyType === '3') {//DE UN USO
      const response = await lastValueFrom(this.ekeyService.sendEkey(this.ekeyService.token, this.ekeyService.lockID, datos.recieverName, datos.name, moment().valueOf().toString(), "1", 1));
      const typedResponse = response as sendEkeyResponse;
      if (typedResponse.errcode === 0) {
        if (this.isValidEmail(datos.recieverName)) {
          this.sendEmail_oneTimeEkey(datos.recieverName, datos.name);
        } else {
          console.log("No es un correo, por lo tanto deberia ser un numero. Mandar mensaje de texto en vez de correo")
        }
      } else {
        console.log("error:",typedResponse);
      }
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
      const response = await lastValueFrom(this.ekeyService.sendEkey(this.ekeyService.token, this.ekeyService.lockID, datos.recieverName, datos.name, newStartDate.toString(), newEndDate.toString(), 4, 1, newStartDay.toString(), newEndDay.toString(), JSON.stringify(selectedDayNumbers)))
      const typedResponse = response as sendEkeyResponse;
      if (typedResponse.errcode === 0) {
        if (this.isValidEmail(datos.recieverName)) {
          console.log(selectedDayNumbers)
          this.sendEmail_solicitanteEkey(datos.recieverName, datos.name, this.getSelectedDayNames(selectedDayNumbers, this.weekDays), moment(newStartDate).format('HH:mm'), moment(newEndDate).format('HH:mm'));
        } else {
          console.log("No es un correo, por lo tanto deberia ser un numero. Mandar mensaje de texto en vez de correo")
        }
      } else {
        console.log("error:",typedResponse);
      }
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
              console.log(datos)
              this.crearEkey(datos);
              localStorage.setItem(datos.recieverName, "1")
              this.router.navigate(["users", this.username, "lock", this.lockId]);
            }
          }
        }
      }
    }
  }
  getSelectedDayNames(selectedDayNumbers: number[], weekDays: { name: string; value: number; checked: boolean }[]): string {
    const selectedDays = weekDays.filter(day => selectedDayNumbers.includes(day.value));
    const selectedDayNames = selectedDays.map(day => day.name);
    return selectedDayNames.join(', ');
  }
  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }
  sendEmail_permanentEkey(recipientEmail: string, keyName: string) {
    emailjs.send('contact_service', 'Ekey_sharing_permanent', {
      to_email: recipientEmail,
      from_name: this.username,
      reply_to: this.username,
      subject: 'Una eKey ha sido compartida contigo',
      to_name: recipientEmail,
      lock_alias: this.lockAlias,
      ekey_name: keyName
    }, 'IHg0KzBkt_UoFb1yg')
      .then((response) => { console.log('Email sent successfully:', response); })
      .catch((error) => { console.error('Error sending email:', error); });
  }
  sendEmail_periodicEkey(recipientEmail: string, keyName: string, start: string, end: string) {
    emailjs.send('contact_service', 'Ekey_sharing_periodic', {
      to_email: recipientEmail,
      from_name: this.username,
      reply_to: this.username,
      subject: 'Una eKey ha sido compartida contigo',
      to_name: recipientEmail,
      lock_alias: this.lockAlias,
      ekey_name: keyName,
      start: start,
      end: end
    }, 'IHg0KzBkt_UoFb1yg')
      .then((response) => { console.log('Email sent successfully:', response); })
      .catch((error) => { console.error('Error sending email:', error); });
  }
  sendEmail_oneTimeEkey(recipientEmail: string, keyName: string) {
    emailjs.send('contact_service', 'Ekey_sharing_once', {
      to_email: recipientEmail,
      from_name: this.username,
      reply_to: this.username,
      subject: 'Una eKey ha sido compartida contigo',
      to_name: recipientEmail,
      lock_alias: this.lockAlias,
      ekey_name: keyName
    }, 'JGXYy0TqnFt_IB5f4')
      .then((response) => { console.log('Email sent successfully:', response); })
      .catch((error) => { console.error('Error sending email:', error); });
  }
  sendEmail_solicitanteEkey(recipientEmail: string, keyName: string, weekDays: string, start: string, end: string) {
    emailjs.send('contact_service', 'Ekey_sharing_solicitante', {
      to_email: recipientEmail,
      from_name: this.username,
      reply_to: this.username,
      subject: 'Una eKey ha sido compartida contigo',
      to_name: recipientEmail,
      lock_alias: this.lockAlias,
      ekey_name: keyName,
      week_days: weekDays,
      start: start,
      end: end
    }, 'JGXYy0TqnFt_IB5f4')
      .then((response) => { console.log('Email sent successfully:', response); })
      .catch((error) => { console.error('Error sending email:', error); });
  }
}
