import { Component } from '@angular/core';
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


@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.css']
})
export class PopUpComponent {

  gatewayEncontrado: GatewayAccount | undefined
  redWiFi:string | undefined;

  displayedColumnsGateway: string[] = ['NombreGateway', 'NombreWifi', 'Signal']

  constructor(public dialogRef: MatDialog,
    private router:Router,
    public popupService: PopUpService,
    public ekeyService: EkeyServiceService,
    private passcodeService: PasscodeServiceService,
    private cardService: CardServiceService,
    private fingerprintService: FingerprintServiceService){}

  navigateToLogin(){
    this.popupService.confirmRegister= false;
    this.router.navigate(['/login']);
  }
    
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

  async autorizar(){
    await this.ekeyService.AuthorizeEkey(this.popupService.token, this.popupService.lockID, this.popupService.elementID);
    this.popupService.confirmAutorizar = false;
    const username = localStorage.getItem('user')
    this.router.navigate(['/users', username]);
  }

  async desautorizar(){
    await this.ekeyService.cancelAuthorizeEkey(this.popupService.token, this.popupService.lockID, this.popupService.elementID);
    this.popupService.confirmDesautorizar = false;
    const username = localStorage.getItem('user')
    this.router.navigate(['/users', username]);
  }

  async congelar(){
    await this.ekeyService.freezeEkey(this.popupService.token, this.popupService.elementID);
    this.popupService.confirmCongelar = false;
    const username = localStorage.getItem('user')
    this.router.navigate(['/users', username]);
  }
  
  async descongelar(){
    await this.ekeyService.unfreezeEkey(this.popupService.token, this.popupService.elementID);
    this.popupService.confirmDescongelar = false;
    const username = localStorage.getItem('user')
    this.router.navigate(['/users', username]);
  }

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

  encontrarRed(gatewayID: number){
    this.gatewayEncontrado = this.popupService.gatewaysOfAccount.find( (gw: {gatewayId: number}) => gw.gatewayId === gatewayID)
    this.redWiFi = this.gatewayEncontrado?.networkName;
    return this.redWiFi;
  }

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
}
