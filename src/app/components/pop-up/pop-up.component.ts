import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PopUpService } from '../../services/pop-up.service';
import { PasscodeServiceService } from '../../services/passcode-service.service';
import { EkeyServiceService } from '../../services/ekey-service.service';
import { CardServiceService } from '../../services/card-service.service';
import { FingerprintServiceService } from '../../services/fingerprint-service.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Formulario } from '../../Interfaces/Formulario';
import moment from 'moment';
import { GatewayAccount } from '../../Interfaces/Gateway';
import { LockServiceService } from '../../services/lock-service.service';
import { GroupService } from '../../services/group.service';
import { LockData } from '../../Interfaces/Lock';
import { UserServiceService } from '../../services/user-service.service';
import { lastValueFrom } from 'rxjs';
import { operationResponse } from '../../Interfaces/Elements';
import { ResetPasswordResponse } from '../../Interfaces/User';
import { addGroupResponse } from '../../Interfaces/Group';

@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.css']
})
export class PopUpComponent implements OnInit {
  isLoading: boolean = false;
  //Variables para seccion Gateway
  gatewayEncontrado: GatewayAccount | undefined
  redWiFi: string | undefined;
  displayedColumnsGateway: string[] = ['NombreGateway', 'NombreWifi', 'Signal']
  ////////////////////////////////
  //Variables para seccion Cerrado Automatico
  autoLockToggle = false;
  customAutoLockTime: number = 0;
  selectedType = '';
  error = '';
  ////////////////////////////////
  selectedLockIds: number[] = [];
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(public dialogRef: MatDialog,
    public popupService: PopUpService,
    private router: Router,
    private lockService: LockServiceService,
    public ekeyService: EkeyServiceService,
    private passcodeService: PasscodeServiceService,
    private cardService: CardServiceService,
    private fingerprintService: FingerprintServiceService,
    private groupService: GroupService,
    private cdr: ChangeDetectorRef,
    private userService: UserServiceService
  ) { }

  ngOnInit(): void {
    // Esto es para mostrar los valores actuales del AutoLockTime si es que estaba activado desde antes
    if (this.popupService.detalles) {
      if (this.popupService.detalles.autoLockTime >= 0) {
        this.autoLockToggle = true;
        switch (this.popupService.detalles.autoLockTime) {
          case 5:
            this.selectedType = '1';
            break;
          case 10:
            this.selectedType = '2';
            break;
          case 15:
            this.selectedType = '3';
            break;
          case 30:
            this.selectedType = '4';
            break;
          case 60:
            this.selectedType = '5';
            break;
          default:
            this.selectedType = '6';
            this.customAutoLockTime = this.popupService.detalles.autoLockTime;
        }
      }
    }
  }
  navigateToLogin() {
    this.popupService.registro = false;
    this.router.navigate(['/login']);
  }
  async delete() {
    let response;
    this.isLoading = true;
    try {
      if (this.popupService.delete) {
        switch (this.popupService.elementType) {
          case 'passcode':
            response = await lastValueFrom(this.passcodeService.deletePasscode(this.popupService.token, this.popupService.lockID, this.popupService.elementID)) as operationResponse;
            break;
          case 'ekey':
            response = await lastValueFrom(this.ekeyService.deleteEkey(this.popupService.token, this.popupService.elementID)) as operationResponse;
            break;
          case 'card':
            response = await lastValueFrom(this.cardService.deleteCard(this.popupService.token, this.popupService.lockID, this.popupService.elementID)) as operationResponse;
            break;
          case 'fingerprint':
            response = await lastValueFrom(this.fingerprintService.deleteFingerprint(this.popupService.token, this.popupService.lockID, this.popupService.elementID)) as operationResponse;
            break;
          case 'grupo':
            response = await lastValueFrom(this.groupService.deleteGroup(this.popupService.token, this.popupService.elementID.toString())) as operationResponse;
            break;
          default:
            console.error('Invalid element type for deletion:', this.popupService.elementID);
            break;
        }
      }
      //console.log(response)
      if (response?.errcode === 0) {
        this.popupService.delete = false;
        const username = localStorage.getItem('user')
        this.router.navigate(['/users', username]);
        console.log(this.popupService.elementType, "borrada exitosamente")
      } else {
        this.error = "La acción eliminar no pudo ser completada, intente nuevamente mas tarde."
      }
    } catch (error) {
      console.error("Error while deleting:", error);
    } finally {
      this.isLoading = false;
    }
  }
  async autorizar() {
    await this.ekeyService.AuthorizeEkey(this.popupService.token, this.popupService.lockID, this.popupService.elementID);
    this.popupService.autorizar = false;
    const username = localStorage.getItem('user')
    this.router.navigate(['/users', username]);
  }
  autorizarFalso() {
    console.log("Se cambio el simpleRight de", this.popupService.elementType, "a 0")
    localStorage.setItem(this.popupService.elementType, "0")
    this.popupService.autorizarFalso = false;
  }
  async desautorizar() {
    await this.ekeyService.cancelAuthorizeEkey(this.popupService.token, this.popupService.lockID, this.popupService.elementID);
    this.popupService.desautorizar = false;
    const username = localStorage.getItem('user')
    this.router.navigate(['/users', username]);
  }
  desautorizarFalso() {
    console.log("Se cambio el simpleRight de", this.popupService.elementType, "a 1")
    localStorage.setItem(this.popupService.elementType, "1")
    this.popupService.desautorizarFalso = false;
  }
  async congelar() {
    this.isLoading = true;
    try {
      let response = await lastValueFrom(this.ekeyService.freezeEkey(this.popupService.token, this.popupService.elementID)) as operationResponse;
      //console.log(response)
      if (response.errcode === 0) {
        this.popupService.congelar = false;
        const username = localStorage.getItem('user')
        this.router.navigate(['/users', username]);
        console.log("eKey congelada exitosamente")
      } else {
        this.error = "La acción congelar no pudo ser completada, intente nuevamente mas tarde."
      }
    } catch (error) {
      console.error("Error while freezing:", error);
    } finally {
      this.isLoading = false;
    }
  }
  async descongelar() {
    this.isLoading = true;
    try {
      let response = await lastValueFrom(this.ekeyService.unfreezeEkey(this.popupService.token, this.popupService.elementID));
      //console.log(response)
      if (response.errcode === 0) {
        this.popupService.descongelar = false;
        const username = localStorage.getItem('user')
        this.router.navigate(['/users', username]);
        console.log("eKey descongelada exitosamente")
      } else {
        this.error = "La acción descongelar no pudo ser completada, intente nuevamente mas tarde."
      }
    } catch (error) {
      console.error("Error while unfreezing:", error);
    } finally {
      this.isLoading = false;
    }
  }
  transformarRemoteEnable(Slider: boolean) {
    if (Slider) {
      return '1'
    } else {
      return '2'
    }
  }
  async cambiarNombre(datos: Formulario) {
    this.error = '';
    let response;
    this.isLoading = true;
    try {
      if (!datos.name) {
        this.error = "Por favor ingrese un nombre"
      } else {
        if (this.popupService.cambiarNombre) {
          switch (this.popupService.elementType) {
            case 'ekey':
              response = await lastValueFrom(this.ekeyService.modifyEkey(this.popupService.token, this.popupService.elementID, datos.name, this.transformarRemoteEnable(datos.ekeyRemoteEnable))) as operationResponse;
              break;
            case 'card':
              response = await lastValueFrom(this.cardService.changeName(this.popupService.token, this.popupService.lockID, this.popupService.elementID, datos.name)) as operationResponse;
              break;
            case 'fingerprint':
              response = await lastValueFrom(this.fingerprintService.changeName(this.popupService.token, this.popupService.lockID, this.popupService.elementID, datos.name)) as operationResponse;
              break;
            case 'grupo':
              response = await lastValueFrom(this.groupService.renameGroup(this.popupService.token, this.popupService.elementID.toString(), datos.name)) as operationResponse;
              break;
            default:
              console.error('Invalid element type for deletion:', this.popupService.elementID);
              break;
          }
        }
        console.log(response)
        if (response?.errcode === 0) {
          this.popupService.cambiarNombre = false;
          const username = localStorage.getItem('user')
          this.router.navigate(['/users', username]);
          console.log("Se ha cambiado el nombre de", this.popupService.elementType, "exitosamente")
        }
        if (response?.errcode === -3) {
          this.error = "El nombre ingresado es muy largo"
        } else {
          this.error = "La acción cambiar nombre no pudo ser completada, intente nuevamente mas tarde."
        }
      }
    } catch (error) {
      console.error("Error while changing name:", error);
    } finally {
      this.isLoading = false;
    }
  }
  async cambiarPeriodo(datos: Formulario) {
    this.error = '';
    let response;
    this.isLoading = true;
    try {
      if (!datos.startDate || !datos.startHour || !datos.endDate || !datos.endHour) {
        this.error = "Por favor ingrese los datos requeridos"
      } else {
        let newStartDay = moment(datos.startDate).valueOf()
        let newEndDay = moment(datos.endDate).valueOf()
        let newStartDate = moment(newStartDay).add(this.lockService.transformarHora(datos.startHour), "milliseconds").valueOf()
        let newEndDate = moment(newEndDay).add(this.lockService.transformarHora(datos.endHour), "milliseconds").valueOf()
        if (moment(newEndDate).isAfter(moment(newStartDate))) {
          switch (this.popupService.elementType) {
            case 'ekey':
              response = await lastValueFrom(this.ekeyService.changePeriod(this.popupService.token, this.popupService.elementID, newStartDate.toString(), newEndDate.toString())) as operationResponse;
              break;
            case 'card':
              response = await lastValueFrom(this.cardService.changePeriod(this.popupService.token, this.popupService.lockID, this.popupService.elementID, newStartDate.toString(), newEndDate.toString())) as operationResponse;
              break;
            case 'fingerprint':
              response = await lastValueFrom(this.fingerprintService.changePeriod(this.popupService.token, this.popupService.lockID, this.popupService.elementID, newStartDate.toString(), newEndDate.toString())) as operationResponse;
              break;
            default:
              console.error('Invalid element type for deletion:', this.popupService.elementID);
              break;
          }
          //console.log(response)
          if (response?.errcode === 0) {
            this.popupService.cambiarPeriodo = false;
            const username = localStorage.getItem('user')
            this.router.navigate(['/users', username]);
          } else {
            this.error = "La acción cambiar periodo no pudo ser completada, intente nuevamente mas tarde"
          }
        } else {
          this.error = 'La fecha de término no puede ser antes que la fecha de inicio';
        }
      }
    } catch (error) {
      console.error("Error while changing period:", error);
    } finally {
      this.isLoading = false;
    }
  }
  async editarPasscode(datos: Formulario) {
    let response;
    let newStartDate;
    let newEndDate;
    this.error = '';
    this.isLoading = true;
    try {
      if (datos.startDate && datos.startHour) {
        let newStartDay = moment(datos.startDate).valueOf()
        newStartDate = moment(newStartDay).add(this.lockService.transformarHora(datos.startHour), "milliseconds").valueOf()
      }
      if (datos.endDate && datos.endHour) {
        let newEndDay = moment(datos.endDate).valueOf()
        newEndDate = moment(newEndDay).add(this.lockService.transformarHora(datos.endHour), "milliseconds").valueOf()
      }
      if (this.popupService.passcode.keyboardPwdType === 1 || this.popupService.passcode.keyboardPwdType === 2 || this.popupService.passcode.keyboardPwdType === 4) {
        response = await lastValueFrom(this.passcodeService.changePasscode(this.popupService.token, this.popupService.lockID, this.popupService.elementID, datos.name, datos.passcodePwd)) as operationResponse;
      }
      if (this.popupService.passcode.keyboardPwdType === 3) {
        response = await lastValueFrom(this.passcodeService.changePasscode(this.popupService.token, this.popupService.lockID, this.popupService.elementID, datos.name, datos.passcodePwd, newStartDate?.toString(), newEndDate?.toString())) as operationResponse
      }
      //console.log(response)
      if (response?.errcode === 0) {
        this.popupService.editarPasscode = false;
        const username = localStorage.getItem('user')
        this.router.navigate(['/users', username]);
        console.log("passcode editada correctamente");
      }
      if (response?.errcode === -3008) {
        this.error = "No se puede editar una passcode que no haya sido usada antes";
      }
      if (response?.errcode === -3007) {
        this.error = "Por favor ingresa un código diferente";
      }
      if (response?.errcode === -3006) {
        this.error = "El código debe tener entre 4 y 9 digitos";//TTLock dice entre 6-9
      }
    } catch (error) {
      console.error("Error while editing a passcode:", error);
    } finally {
      this.isLoading = false;
    }
  }
  encontrarRed(gatewayID: number) {
    this.gatewayEncontrado = this.popupService.gatewaysOfAccount.find((gw: { gatewayId: number }) => gw.gatewayId === gatewayID)
    this.redWiFi = this.gatewayEncontrado?.networkName;
    return this.redWiFi;
  }
  displayrssi(rssi: number) {
    if (rssi > -75) {
      return 'Fuerte '.concat(rssi.toString());
    }
    if (rssi < -85) {
      return 'Debil '.concat(rssi.toString());
    }
    else {
      return 'Mediana '.concat(rssi.toString());
    }
  }
  onSelected(value: string): void {
    this.selectedType = value;
    if (this.selectedType !== '6') { this.customAutoLockTime = 0; }
  }
  autoLockToggleChange(event: any) {
    this.autoLockToggle = event.checked;
    this.selectedType = this.autoLockToggle ? '1' : '6';
    if (!this.autoLockToggle) { this.customAutoLockTime = 0; }
    this.cdr.detectChanges()
  }
  transformarAsegundos(value: string) {
    switch (value) {
      case "1":
        return 5;
      case "2":
        return 10;
      case "3":
        return 15;
      case "4":
        return 30;
      case "5":
        return 60;
      default:
        return this.customAutoLockTime;
    }
  }
  async cambiarAutoLock() {
    let segundos: number = -1;
    if (this.autoLockToggle) {
      segundos = this.transformarAsegundos(this.selectedType)
    }
    this.isLoading = true;
    try {
      let response = await lastValueFrom(this.lockService.setAutoLock(this.popupService.token, this.popupService.lockID, segundos)) as operationResponse;
      console.log(response);
      if (response.errcode === 0) {
        this.popupService.cerradoAutomatico = false;
        const username = localStorage.getItem('user')
        this.router.navigate(['/users', username]);
      } else {
        this.error = "No se pudo completar la acción, intente nuevamente más tarde"
      }
    } catch (error) {
      console.error("Error while setting auto lock:", error);
    } finally {
      this.isLoading = false;
    }
  }
  formatearHora() {
    return moment(this.popupService.currentTime).format("DD/MM/YYYY HH:mm:ss")
  }
  async crearGrupo(datos: Formulario) {
    this.error = '';
    this.isLoading = true;
    try {
      if (!datos.name) {
        this.error = "Por favor ingrese el dato requerido"
      } else {
        let response = await lastValueFrom(this.groupService.addGroup(this.popupService.token, datos.name)) as addGroupResponse;
        //console.log("Respuesta de crear grupo:",response)
        if (response.groupId) {
          this.popupService.newGroup = false;
          const username = localStorage.getItem('user')
          this.router.navigate(['/users', username]);
        } else if(response.errcode === -3) {
          this.error = "El nombre ingresado es muy largo";
        } else {
          this.error = "No se pudo completar la acción, intente nuevamente más tarde";
        }
      }
    } catch (error) {
      console.error("Error while creating a group:", error);
    } finally {
      this.isLoading = false;
    }
  }
  openAddLockGroup() {
    this.popupService.addLockGROUP = true;
    this.popupService.addRemoveLockGROUP = false;
  }
  openRemoveLockGroup() {
    this.popupService.removeLockGROUP = true;
    this.popupService.addRemoveLockGROUP = false;
  }
  toggleLockSelection(lockId: number) {
    const index = this.selectedLockIds.indexOf(lockId);
    if (index !== -1) {
      // If lock ID is already in the array, remove it
      this.selectedLockIds.splice(index, 1);
    } else {
      // If lock ID is not in the array, add it
      this.selectedLockIds.push(lockId);
    }
    console.log("selectedLockIds: ", this.selectedLockIds)
  }
  toggleLockSelection2(lock: LockData) {
    const lockIdIndex = this.selectedLockIds.indexOf(lock.lockId);
    if (lockIdIndex === -1) {
      this.selectedLockIds.push(lock.lockId);
    } else {
      this.selectedLockIds.splice(lockIdIndex, 1);
    }
  }
  async removeSelectedLocksFromGroup() {
    this.isLoading = true;
    try {
      if (this.selectedLockIds.length === 0) {
        console.log("Seleccione al menos una cerradura para remover");
      } else {
        for (const lockId of this.selectedLockIds) {
          await this.groupService.setGroupofLock(this.popupService.token, lockId.toString(), "0")
        }
        this.popupService.removeLockGROUP = false;
        const username = localStorage.getItem('user')
        this.router.navigate(['/users', username]);
      }
    } catch (error) {
      console.error("Error while removing locks from a group:", error);
    } finally {
      this.isLoading = false;
    }
  }
  async addSelectedLocksToGroup() {
    this.isLoading = true;
    try {
      if (this.selectedLockIds.length === 0) {
        console.log("Seleccione al menos una cerradura para añadir");
      } else {
        for (const lockId of this.selectedLockIds) {
          await this.groupService.setGroupofLock(this.popupService.token, lockId.toString(), this.popupService.group.groupId.toString());
        }
        this.popupService.addLockGROUP = false;
        const username = localStorage.getItem('user');
        this.router.navigate(['/users', username]);
      }
    } catch (error) {
      console.error("Error while adding locks from a group:", error);
    } finally {
      this.isLoading = false;
    }
  }
  isLockSelected(lockId: number): boolean {
    return this.ekeyService.selectedLocks.includes(lockId);
  }
  selectLocks() {
    this.ekeyService.selectedLocks = this.popupService.selectedLockIds_forMultipleEkeys
    this.popupService.selectLocksForMultipleEkeys = false;
  }
  addRecipientPair() {
    this.popupService.recipients.push({ username: '', ekeyName: '' });
  }
  removeRecipientPair(index: number) {
    this.popupService.recipients.splice(index, 1);
  }
  onSubmit() {
    console.log(this.popupService.recipients)
    this.ekeyService.recipients = this.popupService.recipients;
    this.popupService.addRecipientsForMultipleEkeys = false;
  }
  async resetPassword() {
    this.error = ''
    this.isLoading = true;
    try {
      if (this.currentPassword !== '' && this.newPassword !== '' && this.confirmPassword !== '') {
        if (this.currentPassword === localStorage.getItem('password')) {
          const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
          if (passwordPattern.test(this.newPassword)) {
            if (this.newPassword === this.confirmPassword) {
              let response = await lastValueFrom(this.userService.ResetPassword("bhaaa_".concat(this.userService.customBase64Encode(localStorage.getItem('user') ?? '')), this.newPassword)) as ResetPasswordResponse;
              console.log(response)
              if (response.errcode === 0) {
                localStorage.setItem('password', this.newPassword)
                this.popupService.resetPassword = false;
                this.router.navigate(['/users', localStorage.getItem('user') ?? '']);
              } else {
                this.error = "No se pudo completar la acción, intente nuevamente más tarde";
              }
            } else {
              this.error = 'No coincide la contraseña. Por favor intente de nuevo'
            }
          } else {
            this.error = 'Tu contraseña debe tener entre 8-20 caracteres e incluir al menos un número, letra y símbolo'
          }
        } else {
          this.error = 'Contraseña inválida'
        }
      } else {
        this.error = 'Por favor, introduzca una contraseña'
      }
    } catch (error) {
      console.error("Error while resetting the password of the account:", error);
    } finally {
      this.isLoading = false;
    }
  }
  compartirCodigo(datos: Formulario) {
    this.error = '';
    this.isLoading = true;
    try {
      if (this.userService.isValidEmail(datos.name)) {
        if (this.popupService.passcode.keyboardPwdType === 1) {//De un uso
          this.passcodeService.sendEmail_OneUsePasscode(datos.name, this.popupService.passcode.keyboardPwd)
        }
        else if (this.popupService.passcode.keyboardPwdType === 2) {//Permanente
          this.passcodeService.sendEmail_PermanentPasscode(datos.name, this.popupService.passcode.keyboardPwd)
        }
        else if (this.popupService.passcode.keyboardPwdType === 3) {//Peridica
          this.passcodeService.sendEmail_PeriodPasscode(datos.name, this.popupService.passcode.keyboardPwd, moment(this.popupService.passcode.startDate).format("DD/MM/YYYY HH:mm"), moment(this.popupService.passcode.endDate).format("DD/MM/YYYY HH:mm"))
        }
        else if (this.popupService.passcode.keyboardPwdType === 4) {//Borrar
          this.passcodeService.sendEmail_ErasePasscode(datos.name, this.popupService.passcode.keyboardPwd)
        }
        else {//Recurrente
          this.passcodeService.sendEmail_RecurringPasscode(datos.name, this.popupService.passcode.keyboardPwd, moment(this.popupService.passcode.startDate).format("HH:mm"), moment(this.popupService.passcode.endDate).format("HH:mm"), this.popupService.passcode.keyboardPwdType);
        }
        this.popupService.sharePasscode = false;
      } else {
        this.error = "Ingrese un correo electrónico válido."
      }
    } catch (error) {
      console.error("Error while sending email to share a passcode:", error);
    } finally {
      this.isLoading = false;
    } 
  }
}
