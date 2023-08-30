import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PopUpService } from '../services/pop-up.service';
import { PasscodeServiceService } from '../services/passcode-service.service';
import { EkeyServiceService } from '../services/ekey-service.service';
import { CardServiceService } from '../services/card-service.service';
import { FingerprintServiceService } from '../services/fingerprint-service.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Formulario } from '../Interfaces/Formulario';
import moment from 'moment';
import { GatewayAccount } from '../Interfaces/Gateway';
import { LockServiceService } from '../services/lock-service.service';
import { GroupService } from '../services/group.service';
import { LockData } from '../Interfaces/Lock';
import { RecipientList } from '../Interfaces/RecipientList';
import { UserServiceService } from '../services/user-service.service';


@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.css']
})
export class PopUpComponent implements OnInit {
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
    if (this.popupService.delete) {
      switch (this.popupService.elementType) {
        case 'passcode':
          await this.passcodeService.deletePasscode(this.popupService.token, this.popupService.lockID, this.popupService.elementID);
          break;
        case 'ekey':
          await this.ekeyService.deleteEkey(this.popupService.token, this.popupService.elementID);
          break;
        case 'card':
          await this.cardService.deleteCard(this.popupService.token, this.popupService.lockID, this.popupService.elementID);
          break;
        case 'fingerprint':
          await this.fingerprintService.deleteFingerprint(this.popupService.token, this.popupService.lockID, this.popupService.elementID);
          break;
        case 'grupo':
          await this.groupService.deleteGroup(this.popupService.token, this.popupService.elementID.toString());
          break;
        default:
          console.error('Invalid element type for deletion:', this.popupService.elementID);
          break;
      }
    }
    this.popupService.delete = false;
    const username = localStorage.getItem('user')
    this.router.navigate(['/users', username]);
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
    await this.ekeyService.freezeEkey(this.popupService.token, this.popupService.elementID);
    this.popupService.congelar = false;
    const username = localStorage.getItem('user')
    this.router.navigate(['/users', username]);
  }
  async descongelar() {
    await this.ekeyService.unfreezeEkey(this.popupService.token, this.popupService.elementID);
    this.popupService.descongelar = false;
    const username = localStorage.getItem('user')
    this.router.navigate(['/users', username]);
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
    if (!datos.name) {
      this.error = "Por favor ingrese el dato requerido"
    } else {
      if (this.popupService.cambiarNombre) {
        switch (this.popupService.elementType) {
          case 'ekey':
            await this.ekeyService.modifyEkey(this.popupService.token, this.popupService.elementID, datos.name, this.transformarRemoteEnable(datos.ekeyRemoteEnable));
            break;
          case 'card':
            await this.cardService.changeName(this.popupService.token, this.popupService.lockID, this.popupService.elementID, datos.name);
            break;
          case 'fingerprint':
            await this.fingerprintService.changeName(this.popupService.token, this.popupService.lockID, this.popupService.elementID, datos.name);
            break;
          case 'grupo':
            await this.groupService.renameGroup(this.popupService.token, this.popupService.elementID.toString(), datos.name);
            break;
          default:
            console.error('Invalid element type for deletion:', this.popupService.elementID);
            break;
        }
      }
      this.popupService.cambiarNombre = false;
      const username = localStorage.getItem('user')
      this.router.navigate(['/users', username]);
    }
  }
  async cambiarPeriodo(datos: Formulario) {
    this.error = '';
    if (!datos.startDate || !datos.startHour || !datos.endDate || !datos.endHour) {
      this.error = "Por favor ingrese los datos requeridos"
    } else {
      const startDate = moment(datos.startDate).format("YYYY-MM-DD");
      const endDate = moment(datos.endDate).format("YYYY-MM-DD");
      const fechaInicial = startDate.concat('-').concat(datos.startHour);
      const fechaFinal = endDate.concat('-').concat(datos.endHour);
      if (this.popupService.cambiarPeriodo) {
        switch (this.popupService.elementType) {
          case 'ekey':
            await this.ekeyService.changePeriod(this.popupService.token, this.popupService.elementID, this.lockService.convertirDate(fechaInicial), this.lockService.convertirDate(fechaFinal));
            break;
          case 'card':
            await this.cardService.changePeriod(this.popupService.token, this.popupService.lockID, this.popupService.elementID, this.lockService.convertirDate(fechaInicial), this.lockService.convertirDate(fechaFinal));
            break;
          case 'fingerprint':
            await this.fingerprintService.changePeriod(this.popupService.token, this.popupService.lockID, this.popupService.elementID, this.lockService.convertirDate(fechaInicial), this.lockService.convertirDate(fechaFinal));
            break;
          default:
            console.error('Invalid element type for deletion:', this.popupService.elementID);
            break;
        }
      }
      this.popupService.cambiarPeriodo = false;
      const username = localStorage.getItem('user')
      this.router.navigate(['/users', username]);
    }
  }
  async editarPasscode(datos: Formulario) {
    const startDate = moment(datos.startDate).format("YYYY-MM-DD");
    const endDate = moment(datos.endDate).format("YYYY-MM-DD");
    const fechaInicial = startDate.concat('-').concat(datos.startHour);
    const fechaFinal = endDate.concat('-').concat(datos.endHour);
    if (this.popupService.editarPasscode) {
      await this.passcodeService.changePasscode(this.popupService.token, this.popupService.lockID, this.popupService.elementID, datos.name, datos.passcodePwd, this.lockService.convertirDate(fechaInicial), this.lockService.convertirDate(fechaFinal));
    }
    this.popupService.editarPasscode = false;
    const username = localStorage.getItem('user')
    this.router.navigate(['/users', username]);
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
    await this.lockService.setAutoLock(this.popupService.token, this.popupService.lockID, segundos);
    this.popupService.cerradoAutomatico = false;
    const username = localStorage.getItem('user')
    this.router.navigate(['/users', username]);
  }
  formatearHora() {
    return moment(this.popupService.currentTime).format("DD/MM/YYYY HH:mm:ss")
  }
  async crearGrupo(datos: Formulario) {
    this.error = '';
    if (!datos.name) {
      this.error = "Por favor ingrese el dato requerido"
    } else {
      await this.groupService.addGroup(this.popupService.token, datos.name);
      this.popupService.newGroup = false;
      const username = localStorage.getItem('user')
      this.router.navigate(['/users', username]);
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
  }
  async addSelectedLocksToGroup() {
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
  }
  isLockSelected(lockId: number): boolean {
    return this.ekeyService.selectedLocks.includes(lockId);
  }
  selectLocks(){
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
  async resetPassword(){
    this.error = ''
    console.log("Contraseña actual:",this.currentPassword)
    console.log("Contraseña nueva:",this.newPassword)
    console.log("Contraseña confirmar nueva:",this.confirmPassword)
    if(this.currentPassword!=='' && this.newPassword!=='' && this.confirmPassword!==''){
      if(this.currentPassword === localStorage.getItem('password')){
        const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if(passwordPattern.test(this.newPassword)) {
          if(this.newPassword===this.confirmPassword){
            await this.userService.ResetPassword(localStorage.getItem('user')  ?? '', this.newPassword)
            localStorage.setItem('password', this.newPassword)
            this.popupService.resetPassword = false;
            this.router.navigate(['/users', localStorage.getItem('user')  ?? '']);
          } else {
            this.error = 'No coincide la contraseña. Por favor intente de nuevo'
          }
        } else {
          this.error = 'Tu contraseña debe tener entre 8-20 caracteres e incluir al menos un número, letra y símbolos'
        }
      } else {
        this.error = 'Contraseña inválida'
      }
    } else {
      this.error = 'Por favor, introduzca una contraseña'
    }
    
  }
}
