import { Component } from '@angular/core';
import { EkeyServiceService } from '../../services/ekey-service.service';
import { Router } from '@angular/router';
import { Formulario } from '../../Interfaces/Formulario';
import moment from 'moment';

import { sendEkeyResponse } from '../../Interfaces/Elements';
import { lastValueFrom } from 'rxjs';
import { UserServiceService } from '../../services/user-service.service';
import { LockServiceService } from '../../services/lock-service.service';
import { UserRegisterResponse } from 'src/app/Interfaces/User';

@Component({
  selector: 'app-ekey',
  templateUrl: './ekey.component.html',
  styleUrls: ['./ekey.component.css']
})
export class EkeyComponent {

  constructor(private router: Router, public ekeyService: EkeyServiceService, private userService: UserServiceService, private lockService: LockServiceService) { }
  username = localStorage.getItem('user') ?? ''
  lockId: number = Number(localStorage.getItem('lockID') ?? '')
  isLoading: boolean = false;
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
        let endDate = moment(diaFinal).add(this.lockService.transformarHora(horaFinal), "milliseconds")
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
      let startDate = moment(diaInicial).add(this.lockService.transformarHora(horaInicial), "milliseconds")
      let endDate = moment(diaFinal).add(this.lockService.transformarHora(horaFinal), "milliseconds")
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
    this.isLoading = true;
    try {
      if (datos.ekeyType === '1') {
        ///////////PERMANENTE////////////////////////////////
        // 1 - Primero manda eKey. Dependiendo de la respuesta, se sabrá si es cuenta TTLock o cuenta VOHK
        // 2 - Si es cuenta TTLock(la eKey se mandó), hay que notificar por correo si el destinatario es email, por wsp si el destinatario es número
        // 3 - Si no es cuenta TTLock(la eKey no se mandó), hay 2 opciones: Es cuenta VOHK o es una cuenta que no existe
        // 4 - Se intenta registrar al destinatario. Dependiendo de la respuesta, se sabrá si es cuenta VOHK o cuenta que no existe
        // 5 - Si es cuenta VOHK (no se pudo registrar el destinatario porque ya existe alguien con ese nombre), hay que mandar la eKey a cuenta VOHK, notificar por correo
        //     si el destinatario es email, por wsp si el destinatario es número
        // 6 - Si es cuenta que no existe(se registró el destinatario), hay que mandar la eKey a cuenta nueva VOHK, notificar por correo si el destinatario es email, 
        //     por wsp si el destinatario es número
        let sendEkeyResponse = await lastValueFrom(this.ekeyService.sendEkey(this.ekeyService.token, this.ekeyService.lockID, datos.recieverName, datos.name, "0", "0", 1)) as sendEkeyResponse;
        console.log("Primer intento(cuenta TTLock)", sendEkeyResponse)
        if (sendEkeyResponse.errcode === 0) {//Si existe una cuenta TTLock con el nombre ingresado
          console.log("Es una cuenta que ya existe creada en TTLock, estoy compartiendo eKey con recieverName=", datos.recieverName)
          if (this.userService.isValidEmail(datos.recieverName)) {//la cuenta es email asi que se manda correo
            this.ekeyService.sendEmail_permanentEkey(datos.recieverName, datos.name)
          } else {//la cuenta es numero de celular
            console.log("mandar mensaje de wsp")
          }
          localStorage.setItem(datos.recieverName, "1");
          this.router.navigate(["users", this.username, "lock", this.lockId]);
        }
        else if (sendEkeyResponse.errcode === -1002) {//No existe una cuenta TTLock con el nombre ingresado, asi que se intenta con cuenta PC
          let encode = this.userService.customBase64Encode(datos.recieverName)
          let new_password = this.generateRandomPassword();
          let userRegisterResponse = await lastValueFrom(this.userService.UserRegister(encode, new_password)) as UserRegisterResponse;
          console.log("Segundo intento(cuenta PC)", userRegisterResponse)
          if (userRegisterResponse.username) {//La cuenta no existía, se crea ahora
            console.log("Se creó una cuenta nueva con nombre=", 'bhaaa_'.concat(encode), "y contraseña=", new_password)
            sendEkeyResponse = await (lastValueFrom(this.ekeyService.sendEkey(this.ekeyService.token, this.ekeyService.lockID, 'bhaaa_'.concat(encode), datos.name, "0", "0", 1))) as sendEkeyResponse;
            if (sendEkeyResponse.errcode === 0) {//Se envia correctamente la ekey a la cuenta nueva
              if (this.userService.isValidEmail(datos.recieverName)) {//la cuenta es email asi que se manda correo
                this.ekeyService.sendEmail_permanentEkey_newAccount(datos.recieverName, datos.name, new_password)
              } else {//la cuenta es numero de celular
                console.log("mandar mensaje de wsp")
              }
              localStorage.setItem(datos.recieverName, "1");
              this.router.navigate(["users", this.username, "lock", this.lockId]);
            } else {//La ekey no se pudo envío 
              console.log("Error:",sendEkeyResponse)
            }
          }
          else if (userRegisterResponse.errcode === 30003) {//Es una cuenta existente creada en el PC
            console.log("La cuenta ya existía, pero no fue creada en TTLock, fue creada en el PC")
            sendEkeyResponse = await (lastValueFrom(this.ekeyService.sendEkey(this.ekeyService.token, this.ekeyService.lockID, 'bhaaa_'.concat(encode), datos.name, "0", "0", 1))) as sendEkeyResponse;
            if(sendEkeyResponse.errcode === 0){//Se envia correctamente la ekey a la cuenta de PC
              if (this.userService.isValidEmail(datos.recieverName)) {//la cuenta es email asi que se manda correo
                this.ekeyService.sendEmail_permanentEkey(datos.recieverName, datos.name)
              } else {//la cuenta es numero de celular
                console.log("mandar mensaje de wsp")
              }
              localStorage.setItem(datos.recieverName, "1");
              this.router.navigate(["users", this.username, "lock", this.lockId]);
            } else {//La ekey no se pudo envío 
              console.log("Error:",sendEkeyResponse)
            }
          }
        }

        /*
        const response = await lastValueFrom(this.ekeyService.sendEkey(this.ekeyService.token, this.ekeyService.lockID, datos.recieverName, datos.name, "0", "0", 1));
        const typedResponse = response as sendEkeyResponse;
        if (typedResponse.errcode === 0) {//La ekey fue recibida correctamente
          if (this.userService.isValidEmail(datos.recieverName)) {//La cuenta es un correo electronico
            if (await this.userService.isEmailNew(datos.recieverName)) {//La cuenta de destinatario fue creada ahora
              console.log("La cuenta es nueva, cambiar contraseña")
              this.ekeyService.sendEmail_permanentEkey_newAccount(datos.recieverName, datos.name, "il.com")
            } else {//La cuenta de destinatario ya existia
              this.ekeyService.sendEmail_oneTimeEkey(datos.recieverName, datos.name);
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
        */
        ///////////AQUI TERMINA EKEY PERMANENTE///////////////////////////////////////////////////////
      }
      else if (datos.ekeyType === '2') {

        ///////////PERIODICA//////////////////////////////////////////////////////////////////
        let newStartDay = moment(datos.startDate).valueOf()
        let newEndDay = moment(datos.endDate).valueOf()
        let newStartDate = moment(newStartDay).add(this.lockService.transformarHora(datos.startHour), "milliseconds").valueOf()
        let newEndDate = moment(newEndDay).add(this.lockService.transformarHora(datos.endHour), "milliseconds").valueOf()
        let sendEkeyResponse = await lastValueFrom(this.ekeyService.sendEkey(this.ekeyService.token, this.ekeyService.lockID, datos.recieverName, datos.name, newStartDate.toString(), newEndDate.toString(), 1)) as sendEkeyResponse;
        console.log("Primer intento(cuenta TTLock)", sendEkeyResponse)
        if (sendEkeyResponse.errcode === 0) {//Si existe una cuenta TTLock con el nombre ingresado
          console.log("Es una cuenta que ya existe creada en TTLock, estoy compartiendo eKey con recieverName=", datos.recieverName)
          if (this.userService.isValidEmail(datos.recieverName)) {//la cuenta es email asi que se manda correo
            this.ekeyService.sendEmail_permanentEkey(datos.recieverName, datos.name)
          } else {//la cuenta es numero de celular
            console.log("mandar mensaje de wsp")
          }
          localStorage.setItem(datos.recieverName, "1");
          this.router.navigate(["users", this.username, "lock", this.lockId]);
        }
        else if (sendEkeyResponse.errcode === -1002) {//No existe una cuenta TTLock con el nombre ingresado, asi que se intenta con cuenta PC
          let encode = this.userService.customBase64Encode(datos.recieverName)
          let new_password = this.generateRandomPassword();
          let userRegisterResponse = await lastValueFrom(this.userService.UserRegister(encode, new_password)) as UserRegisterResponse;
          console.log("Segundo intento(cuenta PC)", userRegisterResponse)
          if (userRegisterResponse.username) {//La cuenta no existía, se crea ahora
            console.log("Se creó una cuenta nueva con nombre=", 'bhaaa_'.concat(encode), "y contraseña=", new_password)
            sendEkeyResponse = await (lastValueFrom(this.ekeyService.sendEkey(this.ekeyService.token, this.ekeyService.lockID, 'bhaaa_'.concat(encode), datos.name, newStartDate.toString(), newEndDate.toString(), 1))) as sendEkeyResponse;
            if (sendEkeyResponse.errcode === 0) {//Se envia correctamente la ekey a la cuenta nueva
              if (this.userService.isValidEmail(datos.recieverName)) {//la cuenta es email asi que se manda correo
                this.ekeyService.sendEmail_periodicEkey_newAccount(datos.recieverName, datos.name, moment(newStartDate).format("YYYY/MM/DD HH:mm"), moment(newEndDate).format("YYYY/MM/DD HH:mm"), new_password)
              } else {//la cuenta es numero de celular
                console.log("mandar mensaje de wsp")
              }
              localStorage.setItem(datos.recieverName, "1");
              this.router.navigate(["users", this.username, "lock", this.lockId]);
            } else {//La ekey no se pudo envío 
              console.log("Error:",sendEkeyResponse)
            }
          }
          else if (userRegisterResponse.errcode === 30003) {//Es una cuenta existente creada en el PC
            console.log("La cuenta ya existía, pero no fue creada en TTLock, fue creada en el PC")
            sendEkeyResponse = await (lastValueFrom(this.ekeyService.sendEkey(this.ekeyService.token, this.ekeyService.lockID, 'bhaaa_'.concat(encode), datos.name, newStartDate.toString(), newEndDate.toString(), 1))) as sendEkeyResponse;
            if(sendEkeyResponse.errcode === 0){//Se envia correctamente la ekey a la cuenta de PC
              if (this.userService.isValidEmail(datos.recieverName)) {//la cuenta es email asi que se manda correo
                this.ekeyService.sendEmail_periodicEkey(datos.recieverName, datos.name, moment(newStartDate).format("YYYY/MM/DD HH:mm"), moment(newEndDate).format("YYYY/MM/DD HH:mm"))
              } else {//la cuenta es numero de celular
                console.log("mandar mensaje de wsp")
              }
              localStorage.setItem(datos.recieverName, "1");
              this.router.navigate(["users", this.username, "lock", this.lockId]);
            } else {//La ekey no se pudo envío 
              console.log("Error:",sendEkeyResponse)
            }
          }
        }

        /*
        let newStartDay = moment(datos.startDate).valueOf()
        let newEndDay = moment(datos.endDate).valueOf()
        let newStartDate = moment(newStartDay).add(this.lockService.transformarHora(datos.startHour), "milliseconds").valueOf()
        let newEndDate = moment(newEndDay).add(this.lockService.transformarHora(datos.endHour), "milliseconds").valueOf()
        const response = await lastValueFrom(this.ekeyService.sendEkey(this.ekeyService.token, this.ekeyService.lockID, datos.recieverName, datos.name, newStartDate.toString(), newEndDate.toString(), 1));
        const typedResponse = response as sendEkeyResponse;
        if (typedResponse.errcode === 0) {//La ekey fue recibida correctamente
          if (this.userService.isValidEmail(datos.recieverName)) {//La cuenta es un correo electronico
            if (await this.userService.isEmailNew(datos.recieverName)) {//La cuenta de destinatario fue creada ahora
              this.ekeyService.sendEmail_periodicEkey_newAccount(datos.recieverName, datos.name, moment(newStartDate).format("YYYY/MM/DD HH:mm"), moment(newEndDate).format("YYYY/MM/DD HH:mm"), "il.com")
              console.log("La cuenta es nueva, cambiar contraseña")
            } else {//La cuenta de destinatario ya existia
              this.ekeyService.sendEmail_periodicEkey(datos.recieverName, datos.name, moment(newStartDate).format("YYYY/MM/DD HH:mm"), moment(newEndDate).format("YYYY/MM/DD HH:mm"));
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
        */
        ///////////AQUI TERMINA EKEY PERIODICA//////////////////////////////////////////////////////////////////

      }
      else if (datos.ekeyType === '3') {

        ///////////DE UN USO/////////////////////////////////////////////////////////////////////////////
        const response = await lastValueFrom(this.ekeyService.sendEkey(this.ekeyService.token, this.ekeyService.lockID, datos.recieverName, datos.name, moment().valueOf().toString(), "1", 1));
        const typedResponse = response as sendEkeyResponse;
        if (typedResponse.errcode === 0) {//La ekey fue recibida correctamente
          if (this.userService.isValidEmail(datos.recieverName)) {//La cuenta es un correo electronico
            if (await this.userService.isEmailNew(datos.recieverName)) {//La cuenta de destinatario fue creada ahora
              this.ekeyService.sendEmail_oneTimeEkey_newAccount(datos.recieverName, datos.name, "il.com")
              console.log("La cuenta es nueva, cambiar contraseña")
            } else {//La cuenta de destinatario ya existia
              this.ekeyService.sendEmail_oneTimeEkey(datos.recieverName, datos.name);
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
        let newStartDate = moment(newStartDay).add(this.lockService.transformarHora(datos.startHour), "milliseconds").valueOf()
        let newEndDate = moment(newEndDay).add(this.lockService.transformarHora(datos.endHour), "milliseconds").valueOf()
        const selectedDayNumbers: number[] = [];
        this.weekDays.forEach(day => {
          if (day.checked) { selectedDayNumbers.push(day.value) }
        });
        const response = await lastValueFrom(this.ekeyService.sendEkey(this.ekeyService.token, this.ekeyService.lockID, datos.recieverName, datos.name, newStartDate.toString(), newEndDate.toString(), 4, 1, newStartDay.toString(), newEndDay.toString(), JSON.stringify(selectedDayNumbers)))
        const typedResponse = response as sendEkeyResponse;
        if (typedResponse.errcode === 0) {//La ekey fue recibida correctamente
          if (this.userService.isValidEmail(datos.recieverName)) {//La cuenta es un correo electronico
            if (await this.userService.isEmailNew(datos.recieverName)) {//La cuenta de destinatario fue creada ahora
              this.ekeyService.sendEmail_solicitanteEkey_newAccount(datos.recieverName, datos.name, this.getSelectedDayNames(selectedDayNumbers, this.weekDays), moment(newStartDate).format('HH:mm'), moment(newEndDate).format('HH:mm'), "il.com")
              console.log("La cuenta es nueva, cambiar contraseña")
            } else {//La cuenta de destinatario ya existia
              this.ekeyService.sendEmail_solicitanteEkey(datos.recieverName, datos.name, this.getSelectedDayNames(selectedDayNumbers, this.weekDays), moment(newStartDate).format('HH:mm'), moment(newEndDate).format('HH:mm'));
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
    } catch (error) {
      console.error("Error while creating Ekey:", error);
    } finally {
      this.isLoading = false;
    }
  }
}
