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


@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.css']
})
export class PopUpComponent implements OnInit{
  //Variables para seccion Gateway
  gatewayEncontrado: GatewayAccount | undefined
  redWiFi:string | undefined;
  displayedColumnsGateway: string[] = ['NombreGateway', 'NombreWifi', 'Signal']
  ////////////////////////////////
  //Variables para seccion Cerrado Automatico
  autoLockToggle = false;
  customAutoLockTime: number = 0;
  selectedType = '';
  ////////////////////////////////

  constructor(public dialogRef: MatDialog,
    private router:Router,
    private lockService: LockServiceService,
    public popupService: PopUpService,
    private ekeyService: EkeyServiceService,
    private passcodeService: PasscodeServiceService,
    private cardService: CardServiceService,
    private fingerprintService: FingerprintServiceService,
    private cdr: ChangeDetectorRef){}
  
  ngOnInit(): void {
    // Check if autoLockTime is greater than 0 (indicating auto-lock is on)
    if(this.popupService.detalles){
      if (this.popupService.detalles.autoLockTime >= 0) {
        this.autoLockToggle = true;
        // Check the autoLockTime value to set the correct dropdown selection
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
            this.selectedType = '6'; // Custom value
            this.customAutoLockTime = this.popupService.detalles.autoLockTime;
        }
      }
    }
  }
//popup Register
  navigateToLogin(){
    this.popupService.confirmRegister= false;
    this.router.navigate(['/login']);
  }
//popup eKey, passcode, card y fingerprint
  async delete(){
    if (this.popupService.confirmDelete){
      // Perform deletion based on the element type
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
        default:
          console.error('Invalid element type for deletion:', this.popupService.elementID);
          break;
      }
    }
    this.popupService.confirmDelete = false;
    const username = localStorage.getItem('user')
    this.router.navigate(['/users', username]);
  }
//popup eKey
  async autorizar(){
    await this.ekeyService.AuthorizeEkey(this.popupService.token, this.popupService.lockID, this.popupService.elementID);
    this.popupService.confirmAutorizar = false;
    const username = localStorage.getItem('user')
    this.router.navigate(['/users', username]);
  }
//popup eKey
  async desautorizar(){
    await this.ekeyService.cancelAuthorizeEkey(this.popupService.token, this.popupService.lockID, this.popupService.elementID);
    this.popupService.confirmDesautorizar = false;
    const username = localStorage.getItem('user')
    this.router.navigate(['/users', username]);
  }
//popup eKey
  async congelar(){
    await this.ekeyService.freezeEkey(this.popupService.token, this.popupService.elementID);
    this.popupService.confirmCongelar = false;
    const username = localStorage.getItem('user')
    this.router.navigate(['/users', username]);
  }
//popup eKey
  async descongelar(){
    await this.ekeyService.unfreezeEkey(this.popupService.token, this.popupService.elementID);
    this.popupService.confirmDescongelar = false;
    const username = localStorage.getItem('user')
    this.router.navigate(['/users', username]);
  }
//popup eKey, card y fingerprint
  async cambiarNombre(datos: Formulario){
    if(this.popupService.cambiarNombre){
      switch(this.popupService.elementType){
        case 'ekey':
          await this.ekeyService.modifyEkey(this.popupService.token, this.popupService.elementID, datos.name);
          break;
        case 'card':
          await this.cardService.changeName(this.popupService.token, this.popupService.lockID, this.popupService.elementID, datos.name);
          break;
        case 'fingerprint':
          await this.fingerprintService.changeName(this.popupService.token, this.popupService.lockID, this.popupService.elementID, datos.name);
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
//popup eKey, card y fingerprint
  async cambiarPeriodo(datos: Formulario){
    const startDate = moment(datos.startDate).format("YYYY-MM-DD");
    const endDate = moment(datos.endDate).format("YYYY-MM-DD");
    const fechaInicial = startDate.concat('-').concat(datos.startHour);
    const fechaFinal = endDate.concat('-').concat(datos.endHour);
    if(this.popupService.cambiarPeriodo){
      switch(this.popupService.elementType){
        case 'ekey':
          await this.ekeyService.changePeriod(this.popupService.token, this.popupService.elementID, fechaInicial, fechaFinal);
          break;
        case 'card':
          await this.cardService.changePeriod(this.popupService.token, this.popupService.lockID, this.popupService.elementID, fechaInicial, fechaFinal);
          break;
        case 'fingerprint':
          await this.fingerprintService.changePeriod(this.popupService.token, this.popupService.lockID, this.popupService.elementID, fechaInicial, fechaFinal);
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
//popup passcode
  async editarPasscode(datos: Formulario){
    const startDate = moment(datos.startDate).format("YYYY-MM-DD");
    const endDate = moment(datos.endDate).format("YYYY-MM-DD");
    const fechaInicial = startDate.concat('-').concat(datos.startHour);
    const fechaFinal = endDate.concat('-').concat(datos.endHour);
    if(this.popupService.editarPasscode){
      await this.passcodeService.changePasscode(this.popupService.passcode, this.popupService.token, this.popupService.lockID, this.popupService.elementID, datos.name, datos.passcodePwd, fechaInicial, fechaFinal);
    }
    this.popupService.editarPasscode = false;
    const username = localStorage.getItem('user')
    this.router.navigate(['/users', username]);
  }
//popup gateway
  async encontrarRed(gatewayID: number){
    this.gatewayEncontrado = await this.popupService.gatewaysOfAccount.find( (gw: {gatewayId: number}) => gw.gatewayId === gatewayID)
    this.redWiFi = this.gatewayEncontrado?.networkName;
    return this.redWiFi;
  }
//popup gateway
  displayrssi(rssi:number){
    if (rssi > -75){
      return 'Fuerte '.concat(rssi.toString());
    }
    if (rssi < -85){
      return 'Debil '.concat(rssi.toString());
    }
    else {
      return 'Mediana '.concat(rssi.toString());
    }
    
  }
//popup autoLock
  onSelected(value: string): void {
    this.selectedType = value;
    if (this.selectedType !== '6') {this.customAutoLockTime = 0;}}
//popup autoLock
  autoLockToggleChange(event: any){
    this.autoLockToggle = event.checked;
    this.selectedType = this.autoLockToggle ? '1' : '6';
    if (!this.autoLockToggle) {this.customAutoLockTime = 0;}
    this.cdr.detectChanges()}
//popup autoLock
  transformarAsegundos(value:string){
    switch(value){
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
    }}
//popup autoLock
  async cambiarAutoLock(){
    let segundos:number = -1;
    if(this.autoLockToggle){
      segundos = this.transformarAsegundos(this.selectedType)
    }
    await this.lockService.setAutoLock(this.popupService.token, this.popupService.lockID, segundos);
    this.popupService.cerradoAutomatico = false;
    const username = localStorage.getItem('user')
    this.router.navigate(['/users', username]);
  }
//popup Hora Dispositivo
  formatearHora(){
    return moment.utc().add(this.popupService.detalles.timezoneRawOffset, "milliseconds").format("YYYY-MM-DD HH:mm:ss")
  }
}
