import { Component } from '@angular/core';
import { EkeyServiceService } from '../services/ekey-service.service';
import { Router } from '@angular/router';
import { Formulario } from '../Interfaces/Formulario';
import moment from 'moment';
import emailjs from 'emailjs-com';
import { sendEkeyResponse } from '../Interfaces/Elements';
import { lastValueFrom } from 'rxjs';
import { UserServiceService } from '../services/user-service.service';
import { GetAccessTokenResponse, UserRegisterResponse } from '../Interfaces/User';

@Component({
  selector: 'app-ekey',
  templateUrl: './ekey.component.html',
  styleUrls: ['./ekey.component.css']
})
export class EkeyComponent {

  constructor(private router: Router, public ekeyService: EkeyServiceService, private userService: UserServiceService) { }
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

  toMultipleEkeys() {//Navega al componente multiple-ekey
    this.router.navigate(['users', this.username, 'lock', this.lockId, 'ekey', 'multiple'])
  }
  onSelected(value: string): void {//Guarda el tipo de eKey seleccionado
    this.selectedType = value
  }
  onCheckboxChange(event: any, day: any) {//Guarda los dias seleccionados para una eKey de tipo solicitante
    day.checked = event.target.checked
  }
  transformarHora(Tiempo: string) {//Esta funcion está encargada de convertir el resultado del timepicker, un string de formato ("HH:mm"), en un number que representa el tiempo en milisegundos
    let tiempoHora = Tiempo.split(":")[0]
    let tiempoMinuto = Tiempo.split(":")[1]
    return ((Number(tiempoHora) * 60 + Number(tiempoMinuto)) * 60000).toString()
  }
  generateRandomPassword(): string {//Esta funcion retorna una contraseña random 
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@$%*?&";
    const getRandomChar = (charset: string) => {
      const randomIndex = Math.floor(Math.random() * charset.length);
      return charset.charAt(randomIndex);
    };
    let password = "";
    for (let i = 0; i < 6; i++) {
      password += getRandomChar(lowercaseChars);
    }
    password += getRandomChar(numbers);
    password += getRandomChar(symbols);
    return password;
  }
  getSelectedDayNames(selectedDayNumbers: number[], weekDays: { name: string; value: number; checked: boolean }[]): string {//Guarda el nombre de los dias seleccionados para mandarlos por correo
    const selectedDays = weekDays.filter(day => selectedDayNumbers.includes(day.value));
    const selectedDayNames = selectedDays.map(day => day.name);
    return selectedDayNames.join(', ');
  }
  validaFechaUsuario(diaFinal: string, horaFinal: string, tipo: string): boolean {//Calcula si el usuario puede crear una eKey dependiendo de su tiempo restante de validacion
    if (this.ekeyService.endDateUser !== '0') {
      if (tipo === '1' || tipo === '3') {//La ekey es permanente
        this.error = "Usted como usuario con autorización temporal no puede crear una eKey permanente"
        return false
      } else {
        let unixTimestamp = parseInt(this.ekeyService.endDateUser);
        let endUser = moment.unix(unixTimestamp / 1000);
        let endDate = moment(diaFinal).add(this.transformarHora(horaFinal), "milliseconds")
        if (endUser.isBefore(endDate)) {//El usuario termina antes que la ekey
          this.error = "La eKey termina posterior a su permiso de autorización, comuníquese con el administrador de esta cerradura"
          return false;
        } else {//El usuario termina despues que la ekey
          return true
        }
      }
    } else {//El usuario es permanente
      return true;
    }
  }
  validarFechaInicio(diaInicial: string, horaInicial: string, diaFinal: string, horaFinal: string, tipo: string): boolean {//Calcula si el usuario puede crear una eKey dependiendo de las fechas ingresadas
    if (tipo !== '1' && tipo !== '3') {
      let startDate = moment(diaInicial).add(this.transformarHora(horaInicial), "milliseconds")
      let endDate = moment(diaFinal).add(this.transformarHora(horaFinal), "milliseconds")
      if (endDate.isBefore(startDate)) {//La ekey termina antes de la fecha de inicio
        this.error = "El tiempo de inicio debe ser anterior al tiempo de finalización"
        return false;
      } else {//La ekey termina despues de la fecha de inicio
        return true;
      }
    } else {//La ekey es permanente
      return true
    }
  }
  validarInputs(datos: Formulario): boolean {//Verifica que el usuario rellenó los campos necesarios para crear una eKey
    this.error = '';
    if (!datos.recieverName) {
      this.error = "Por favor llene el campo 'Nombre del Destinatario'";
    } else if (!datos.ekeyType) {
      this.error = "Por favor elija un tipo de eKey";
    } else if ((datos.ekeyType === '2' || datos.ekeyType === '4') && (!datos.startDate || !datos.endDate || !datos.startHour || !datos.endHour)) {
      this.error = "Por favor rellene los datos de fecha y/o hora";
    }
    return this.error === '';
  }
  botonGenerarEkey(datos: Formulario) {//Combina las validaciones con la creacion de eKey
    if (this.validarInputs(datos)) {
      if (this.validarFechaInicio(datos.startDate, datos.startHour, datos.endDate, datos.endHour, datos.ekeyType)) {
        if (this.validaFechaUsuario(datos.endDate, datos.endHour, datos.ekeyType)) {
          this.crearEkey(datos);
        }
      }
    }
  }
  async crearEkey(datos: Formulario) {//Dependiendo del tipo de eKey se dan los datos necesarios para generarla
    if (datos.ekeyType === '1') {
      ///////////PERMANENTE/////////////////////////////////
      const response = await lastValueFrom(this.ekeyService.sendEkey(this.ekeyService.token, this.ekeyService.lockID, datos.recieverName, datos.name, "0", "0", 1));
      const typedResponse = response as sendEkeyResponse;
      if (typedResponse.errcode === 0) {//La ekey fue recibida correctamente
        if (this.isValidEmail(datos.recieverName)) {//La cuenta es un correo electronico
          if (await this.isEmailNew(datos.recieverName)) {//La cuenta de destinatario fue creada ahora
            console.log("La cuenta es nueva, cambiar contraseña")
            this.sendEmail_permanentEkey_newAccount(datos.recieverName, datos.name, "il.com")
          } else {//La cuenta de destinatario ya existia
            this.sendEmail_oneTimeEkey(datos.recieverName, datos.name);
            console.log("La cuenta ya existia, mandar correo normal")
          }
        } else {//La cuenta es un numero de celular
          console.log("No es un correo, por lo tanto deberia ser un numero. Mandar mensaje de texto en vez de correo")
        }
        localStorage.setItem(datos.recieverName, "1");
        this.router.navigate(["users", this.username, "lock", this.lockId]);
      } else {
        if (typedResponse.errcode === -1002) {//Destinatario inválido
          this.error = "El nombre del destinatario es inválido"
        }
        console.log("error:", typedResponse);
      }
      ///////////AQUI TERMINA EKEY PERMANENTE///////////////////////////////////////////////////////
    }
    else if (datos.ekeyType === '2') {

      ///////////PERIODICA//////////////////////////////////////////////////////////////////
      let newStartDay = moment(datos.startDate).valueOf()
      let newEndDay = moment(datos.endDate).valueOf()
      let newStartDate = moment(newStartDay).add(this.transformarHora(datos.startHour), "milliseconds").valueOf()
      let newEndDate = moment(newEndDay).add(this.transformarHora(datos.endHour), "milliseconds").valueOf()
      const response = await lastValueFrom(this.ekeyService.sendEkey(this.ekeyService.token, this.ekeyService.lockID, datos.recieverName, datos.name, newStartDate.toString(), newEndDate.toString(), 1));
      const typedResponse = response as sendEkeyResponse;
      if (typedResponse.errcode === 0) {//La ekey fue recibida correctamente
        if (this.isValidEmail(datos.recieverName)) {//La cuenta es un correo electronico
          if (await this.isEmailNew(datos.recieverName)) {//La cuenta de destinatario fue creada ahora
            this.sendEmail_periodicEkey_newAccount(datos.recieverName, datos.name, moment(newStartDate).format("YYYY/MM/DD HH:mm"), moment(newEndDate).format("YYYY/MM/DD HH:mm"), "il.com")
            console.log("La cuenta es nueva, cambiar contraseña")
          } else {//La cuenta de destinatario ya existia
            this.sendEmail_periodicEkey(datos.recieverName, datos.name, moment(newStartDate).format("YYYY/MM/DD HH:mm"), moment(newEndDate).format("YYYY/MM/DD HH:mm"));
            console.log("La cuenta ya existia, mandar correo normal")
          }
        } else {//La cuenta es un numero de celular
          console.log("No es un correo, por lo tanto deberia ser un numero. Mandar mensaje de texto en vez de correo")
        }
        localStorage.setItem(datos.recieverName, "1");
        this.router.navigate(["users", this.username, "lock", this.lockId]);
      } else {
        if (typedResponse.errcode === -1002) {//Destinatario inválido
          this.error = "El nombre del destinatario es inválido"
        }
        console.log("error:", typedResponse);
      }
      ///////////AQUI TERMINA EKEY PERIODICA//////////////////////////////////////////////////////////////////

    }
    else if (datos.ekeyType === '3') {

      ///////////DE UN USO/////////////////////////////////////////////////////////////////////////////
      const response = await lastValueFrom(this.ekeyService.sendEkey(this.ekeyService.token, this.ekeyService.lockID, datos.recieverName, datos.name, moment().valueOf().toString(), "1", 1));
      const typedResponse = response as sendEkeyResponse;
      if (typedResponse.errcode === 0) {//La ekey fue recibida correctamente
        if (this.isValidEmail(datos.recieverName)) {//La cuenta es un correo electronico
          if (await this.isEmailNew(datos.recieverName)) {//La cuenta de destinatario fue creada ahora
            this.sendEmail_oneTimeEkey_newAccount(datos.recieverName, datos.name, "il.com")
            console.log("La cuenta es nueva, cambiar contraseña")
          } else {//La cuenta de destinatario ya existia
            this.sendEmail_oneTimeEkey(datos.recieverName, datos.name);
            console.log("La cuenta ya existia, mandar correo normal")
          }
        } else {//La cuenta es un numero de celular
          console.log("No es un correo, por lo tanto deberia ser un numero. Mandar mensaje de texto en vez de correo")
        }
        localStorage.setItem(datos.recieverName, "1");
        this.router.navigate(["users", this.username, "lock", this.lockId]);
      } else {
        if (typedResponse.errcode === -1002) {//Destinatario inválido
          this.error = "El nombre del destinatario es inválido"
        }
        console.log("error:", typedResponse);
      }
      ///////////AQUI TERMINA EKEY DE UN USO//////////////////////////////////////////////////////////////////

    }
    else if (datos.ekeyType === '4') {

      ///////////SOLICITANTE////////////////////////////////////////////
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
      if (typedResponse.errcode === 0) {//La ekey fue recibida correctamente
        if (this.isValidEmail(datos.recieverName)) {//La cuenta es un correo electronico
          if (await this.isEmailNew(datos.recieverName)) {//La cuenta de destinatario fue creada ahora
            this.sendEmail_solicitanteEkey_newAccount(datos.recieverName, datos.name, this.getSelectedDayNames(selectedDayNumbers, this.weekDays), moment(newStartDate).format('HH:mm'), moment(newEndDate).format('HH:mm'), "il.com")
            console.log("La cuenta es nueva, cambiar contraseña")
          } else {//La cuenta de destinatario ya existia
            this.sendEmail_solicitanteEkey(datos.recieverName, datos.name, this.getSelectedDayNames(selectedDayNumbers, this.weekDays), moment(newStartDate).format('HH:mm'), moment(newEndDate).format('HH:mm'));
            console.log("La cuenta ya existia, mandar correo normal")
          }
        } else {//La cuenta es un numero de celular
          console.log("No es un correo, por lo tanto deberia ser un numero. Mandar mensaje de texto en vez de correo")
        }
        localStorage.setItem(datos.recieverName, "1");
        this.router.navigate(["users", this.username, "lock", this.lockId]);
      } else {
        if (typedResponse.errcode === -1002) {//Destinatario inválido
          this.error = "El nombre del destinatario es inválido"
        }
        console.log("error:", typedResponse);
      }
      ///////////AQUI TERMINA EKEY SOLICITANTE////////////////////////////////////////////

    }
  }
  isValidEmail(email: string): boolean {//Verifica si el nombre del destinatario es un email o no
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }
  async isEmailNew(email: string) {//Verifica si la cuenta del destinatario es nueva.
    const response = await lastValueFrom(this.userService.getAccessToken(email, 'il.com'));
    const typedResponse = response as GetAccessTokenResponse;
    if (typedResponse.access_token) {//El usuario tiene la clave de defecto
      return true;
    } else {
      return false;
    }
  }
  sendEmail_permanentEkey(recipientEmail: string, keyName: string) {//Template para eKey permanente a una cuenta existente
    //esteban.vohk@gmail.com
    emailjs.send('contact_service', 'SendEkeyPermanent', {
      to_email: recipientEmail,
      from_name: this.username,
      subject: 'Una eKey ha sido compartida contigo',
      to_name: recipientEmail,
      lock_alias: this.lockAlias,
      ekey_name: keyName
    }, 'IHg0KzBkt_UoFb1yg')
      .then((response) => { console.log('Email sent successfully:', response); })
      .catch((error) => { console.error('Error sending email:', error); });
  }
  sendEmail_periodicEkey(recipientEmail: string, keyName: string, start: string, end: string) {//Template para eKey periodica a una cuenta existente
    //esteban.vohk@gmail.com
    emailjs.send('contact_service', 'SendEkeyPeriodic', {
      to_email: recipientEmail,
      from_name: this.username,
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
  sendEmail_oneTimeEkey(recipientEmail: string, keyName: string) {//Template para eKey de un uso a una cuenta existente
    //esteban.vohk+1@gmail.com
    emailjs.send('contact_service', 'SendEkeyOneTime', {
      to_email: recipientEmail,
      from_name: this.username,
      subject: 'Una eKey ha sido compartida contigo',
      to_name: recipientEmail,
      lock_alias: this.lockAlias,
      ekey_name: keyName
    }, 'JGXYy0TqnFt_IB5f4')
      .then((response) => { console.log('Email sent successfully:', response); })
      .catch((error) => { console.error('Error sending email:', error); });
  }
  sendEmail_solicitanteEkey(recipientEmail: string, keyName: string, weekDays: string, start: string, end: string) {//Template para eKey solicitante a una cuenta existente
    //esteban.vohk+1@gmail.com
    emailjs.send('contact_service', 'SendEkeySolicitante', {
      to_email: recipientEmail,
      from_name: this.username,
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
  sendEmail_permanentEkey_newAccount(recipientEmail: string, keyName: string, password: string) {//Template para eKey permanente a una cuenta nueva
    //esteban.vohk+2@gmail.com
    emailjs.send('contact_service', 'SendEkeyPermanentNewUser', {
      to_email: recipientEmail,
      from_name: this.username,
      subject: 'Una eKey ha sido compartida contigo',
      to_name: recipientEmail,
      lock_alias: this.lockAlias,
      password: password,
      ekey_name: keyName
    }, '8Q0_n1lg4twgrBlaf')
      .then((response) => { console.log('Email sent successfully:', response); })
      .catch((error) => { console.error('Error sending email:', error); });
  }
  sendEmail_periodicEkey_newAccount(recipientEmail: string, keyName: string, start: string, end: string, password: string) {//Template para eKey periodica a una cuenta nueva
    //esteban.vohk+2@gmail.com
    emailjs.send('contact_service', 'SendEkeyPeriodicNewUser', {
      to_email: recipientEmail,
      from_name: this.username,
      subject: 'Una eKey ha sido compartida contigo',
      to_name: recipientEmail,
      lock_alias: this.lockAlias,
      password: password,
      ekey_name: keyName,
      start: start,
      end: end
    }, '8Q0_n1lg4twgrBlaf')
      .then((response) => { console.log('Email sent successfully:', response); })
      .catch((error) => { console.error('Error sending email:', error); });
  }
  sendEmail_oneTimeEkey_newAccount(recipientEmail: string, keyName: string, password: string) {//Template para eKey de un uso a una cuenta nueva
    //esteban.vohk+3@gmail.com
    emailjs.send('contact_service', 'SendEkeyOneTimeNewUser', {
      to_email: recipientEmail,
      from_name: this.username,
      subject: 'Una eKey ha sido compartida contigo',
      to_name: recipientEmail,
      lock_alias: this.lockAlias,
      password: password,
      ekey_name: keyName
    }, 'ENb99SX5j4gqE1TFZ')
      .then((response) => { console.log('Email sent successfully:', response); })
      .catch((error) => { console.error('Error sending email:', error); });
  }
  sendEmail_solicitanteEkey_newAccount(recipientEmail: string, keyName: string, weekDays: string, start: string, end: string, password: string) {//Template para eKey solicitante a una cuenta nueva
    //esteban.vohk+3@gmail.com
    emailjs.send('contact_service', 'SendEkeySolicitanteNewUs', {
      to_email: recipientEmail,
      from_name: this.username,
      subject: 'Una eKey ha sido compartida contigo',
      to_name: recipientEmail,
      lock_alias: this.lockAlias,
      password: password,
      ekey_name: keyName,
      week_days: weekDays,
      start: start,
      end: end
    }, 'ENb99SX5j4gqE1TFZ')
      .then((response) => { console.log('Email sent successfully:', response); })
      .catch((error) => { console.error('Error sending email:', error); });
  }
}
