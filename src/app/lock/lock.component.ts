import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faBatteryFull,faBatteryThreeQuarters,faBatteryHalf,faBatteryQuarter,faBatteryEmpty, faGear} from '@fortawesome/free-solid-svg-icons'
import moment from 'moment';
import { AccessTokenData } from '../AccessToken';
import { LockData } from '../Lock';
import { Ekey } from '../Ekey';
import { Fingerprint } from '../Fingerprint';
import { Card } from '../Card';
import { Passcode } from '../Passcode';
import { Record } from '../Record';
import { UserServiceService } from '../services/user-service.service';
import { LockServiceService } from '../services/lock-service.service';
import { EkeyServiceService } from '../services/ekey-service.service';
import { PasscodeServiceService } from '../services/passcode-service.service';
import { CardServiceService } from '../services/card-service.service';
import { FingerprintServiceService } from '../services/fingerprint-service.service';
import { RecordServiceService } from '../services/record-service.service';
import { PopUpService } from '../services/pop-up.service';


@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-lock',
  templateUrl: './lock.component.html',
  styleUrls: ['./lock.component.css']
})
export class LockComponent implements OnInit{

  encapsulation:ViewEncapsulation.None;
  ////////////////////////////////////////////////////////////
  faBatteryFull= faBatteryFull
  faBatteryThreeQuarters= faBatteryThreeQuarters
  faBatteryHalf= faBatteryHalf
  faBatteryQuarter= faBatteryQuarter
  faBatteryEmpty= faBatteryEmpty
  faGear= faGear
  ////////////////////////////////////////////////////////////
  lockId: number;
  tokenData: AccessTokenData;
  lock:LockData;
  ////////////////////////////////////////////////////////////
  ekeys: Ekey[] = []
  passcodes: Passcode[] = []
  fingerprints: Fingerprint[] = []
  cards: Card[] = []
  records: Record[] = []
  displayedColumnsEkey: string[] = ['keyName', 'username', 'senderUsername', 'date', 'Asignacion', 'Estado', 'Operacion']
  displayedColumnsPasscode: string[] = ['keyboardPwdName', 'keyboardPwd', 'senderUsername', 'createDate', 'Asignacion', 'Estado', 'Operacion']
  displayedColumnsCard: string[] = ['cardName', 'cardNumber', 'senderUsername', 'createDate', 'Asignacion', 'Estado', 'Operacion']
  displayedColumnsFingerprint: string[] = ['fingerprintName', 'senderUsername', 'createDate', 'Asignacion', 'Estado', 'Operacion']
  displayedColumnsRecord: string[] = ['Operador', 'Metodo_Apertura', 'Horario_Apertura', 'Estado']

  constructor(private route: ActivatedRoute, 
    private router: Router, 
    public popupService: PopUpService,
    private userService: UserServiceService, 
    private lockService: LockServiceService,
    private ekeyService: EkeyServiceService,
    private passcodeService: PasscodeServiceService,
    private cardService: CardServiceService,
    private fingerprintService: FingerprintServiceService,
    private recordService: RecordServiceService,
    ){}

  async ngOnInit() {
    // Get the lockId from route parameters
    this.route.paramMap.subscribe(params => {
      this.lockId = Number(params.get('id'));
      // Use lockId to get the specific lock data
      this.ekeyService.data2$.subscribe((data) => {
        if (data.list) {
          this.lock = data.list.find((lock: { lockId: number; }) => lock.lockId === this.lockId);
          if (!this.lock) {this.router.navigate(['/not-found']);}
        } else {console.log("Data not yet available(ngOnInit de lock component).");}
      })});
    // Subscribe to the user data
    this.userService.data$.subscribe((data) => {this.tokenData = data});
    //Traer ekeys
    try{
      await this.ekeyService.getEkeysofLock(this.tokenData.access_token, this.lockId);
      this.ekeyService.data$.subscribe((data) => {
        if(data?.list) {this.ekeys = data.list}
        else {console.log("Data not yet available.")}
      })} 
    catch(error) {console.error("Error while fetching the eKeys:", error);}
    //Traer passcodes
    try {
      await this.passcodeService.getPasscodesofLock(this.tokenData.access_token, this.lockId);
      this.passcodeService.data$.subscribe((data) => {
        if (data?.list) {this.passcodes = data.list;console.log(this.passcodes)} 
        else {console.log("Data not yet available.")}
      })} 
    catch (error) {console.error("Error while fetching the passcodes:", error)}
    //Traer cards
    try {
      await this.cardService.getCardsofLock(this.tokenData.access_token, this.lockId);
      this.cardService.data$.subscribe((data) => {
        if (data?.list) {this.cards = data.list} 
        else {console.log("Data not yet available.")}
      })} 
    catch (error) {console.error("Error while fetching the cards:", error)}
    //Traer fingerprints
    try {
      await this.fingerprintService.getFingerprintsofLock(this.tokenData.access_token, this.lockId);
      this.fingerprintService.data$.subscribe((data) => {
        if (data?.list) {this.fingerprints = data.list} 
        else {console.log("Data not yet available.")}
      })} 
    catch (error) {console.error("Error while fetching the fingerprints:", error)}
    //Traer records
    try{
      await this.recordService.getRecords(this.tokenData.access_token, this.lockId)
      this.recordService.data$.subscribe((data) => {
        if (data?.list) {this.records = data.list}
        else {console.log("Data not yest available")}
      })}
    catch (error) {console.error("Error while fetching the records:", error)}
  }
  //FUNCIONES PARA FORMATO DE TABLA
  periodoValidez(start:number, end:number){
    if(end === 0){return 'Permanente'} 
    else {
      var inicio = moment(start).format("YYYY/MM/DD HH:mm")
      var final = moment(end).format("YYYY/MM/DD HH:mm")
      var retorno = inicio.toString().concat(' - ').concat(final.toString());
      return retorno}}
  periodoValidezPasscode(passcode: Passcode){
    var respuesta
    if(passcode.keyboardPwdType===1){
      respuesta = moment(passcode.sendDate).format("YYYY/MM/DD HH:mm").concat(' Una Vez');
    }
    if(passcode.keyboardPwdType===2){
      respuesta = 'Permanente'
    }
    if(passcode.keyboardPwdType===3){
      var inicio = moment(passcode.startDate).format("YYYY/MM/DD HH:mm")
      var final = moment(passcode.endDate).format("YYYY/MM/DD HH:mm")
      respuesta = inicio.toString().concat(' - ').concat(final.toString());
    }
    if(passcode.keyboardPwdType===4){
      respuesta = moment(passcode.sendDate).format("YYYY/MM/DD HH:mm").concat(' Borrar');
    }
    if(passcode.keyboardPwdType===5){
      var inicio = moment(passcode.startDate).format(" HH:mm")
      var final = moment(passcode.endDate).format(" HH:mm")
      respuesta = moment(passcode.sendDate).format("YYYY/MM/DD HH:mm").concat(", ",inicio," - ",final," Fin de Semana")
    }
    if(passcode.keyboardPwdType===6){
      var inicio = moment(passcode.startDate).format(" HH:mm")
      var final = moment(passcode.endDate).format(" HH:mm")
      respuesta = moment(passcode.sendDate).format("YYYY/MM/DD HH:mm").concat(", ",inicio," - ",final," Diaria")
    }
    if(passcode.keyboardPwdType===7){
      var inicio = moment(passcode.startDate).format(" HH:mm")
      var final = moment(passcode.endDate).format(" HH:mm")
      respuesta = moment(passcode.sendDate).format("YYYY/MM/DD HH:mm").concat(", ",inicio," - ",final," Dia de Trabajo")
    }
    if(passcode.keyboardPwdType===8){
      var inicio = moment(passcode.startDate).format(" HH:mm")
      var final = moment(passcode.endDate).format(" HH:mm")
      respuesta = moment(passcode.sendDate).format("YYYY/MM/DD HH:mm").concat(", ",inicio," - ",final," Lunes")
    }
    if(passcode.keyboardPwdType===9){
      var inicio = moment(passcode.startDate).format(" HH:mm")
      var final = moment(passcode.endDate).format(" HH:mm")
      respuesta = moment(passcode.sendDate).format("YYYY/MM/DD HH:mm").concat(", ",inicio," - ",final," Martes")
    }
    if(passcode.keyboardPwdType===10){
      var inicio = moment(passcode.startDate).format(" HH:mm")
      var final = moment(passcode.endDate).format(" HH:mm")
      respuesta = moment(passcode.sendDate).format("YYYY/MM/DD HH:mm").concat(", ",inicio," - ",final," Miercoles")
    }
    if(passcode.keyboardPwdType===11){
      var inicio = moment(passcode.startDate).format(" HH:mm")
      var final = moment(passcode.endDate).format(" HH:mm")
      respuesta = moment(passcode.sendDate).format("YYYY/MM/DD HH:mm").concat(", ",inicio," - ",final," Jueves")
    }
    if(passcode.keyboardPwdType===12){
      var inicio = moment(passcode.startDate).format(" HH:mm")
      var final = moment(passcode.endDate).format(" HH:mm")
      respuesta = moment(passcode.sendDate).format("YYYY/MM/DD HH:mm").concat(", ",inicio," - ",final," Viernes")
    }
    if(passcode.keyboardPwdType===13){
      var inicio = moment(passcode.startDate).format(" HH:mm")
      var final = moment(passcode.endDate).format(" HH:mm")
      respuesta = moment(passcode.sendDate).format("YYYY/MM/DD HH:mm").concat(", ",inicio," - ",final," Sabado")
    }
    if(passcode.keyboardPwdType===14){
      var inicio = moment(passcode.startDate).format(" HH:mm")
      var final = moment(passcode.endDate).format(" HH:mm")
      respuesta = moment(passcode.sendDate).format("YYYY/MM/DD HH:mm").concat(", ",inicio," - ",final," Domingo")
    }
    return respuesta;
  }
  consultarEstado(end:number){
    if(end === 0){return 'Valido'} 
    else {
      var ahora = moment().format("YYYY/MM/DD HH:mm")
      var final = moment(end).format("YYYY/MM/DD HH:mm")
      if(moment(final).isBefore(ahora)){return 'Invalido'} 
    else {return 'Valido'}}}
  consulatEstadoPasscode(passcode: Passcode){

  }
  consultarSuccess(success:number){
    if (success == 0){ return 'Fallido'}
    else {return 'Exito'}
  }
  consultarMetodo(tipo:number, operador:string) {
    switch (tipo) {
      case 1:
        return 'Abrir con la aplicación';
      case 4:
        return 'Abrir con código de acceso';
      case 5:
        return 'modify a passcode on the lock';
      case 6:
        return 'delete a passcode on the lock';
      case 7:
        var retorno = 'Abrir con código de acceso—'.concat(operador)
        return retorno;
      case 8:
        return 'clear passcodes from the lock';
      case 9:
        return 'passcode be squeezed out';
      case 10:
        return 'unlock with passcode with delete function, passcode before it will all be deleted';
      case 11:
        return 'unlock by passcode failed—passcode expired';
      case 12:
        return 'unlock by passcode failed—run out of memory';
      case 13:
        return 'unlock by passcode failed—passcode is in blacklist';
      case 14:
        return 'lock power on';
      case 15:
        return 'add card success';
      case 16:
        return 'clear cards';
      case 17:
        return 'Abrir con Tarjeta RF';
      case 18:
        return 'delete an card';
      case 19:
        return 'unlock by wrist strap success';
      case 20:
        return 'Abrir con huella digital';
      case 21:
        return 'add fingerprint';
      case 22:
        return 'unlock by fingerprint failed—fingerprint expired';
      case 23:
        return 'delete a fingerprint';
      case 24:
        return 'clear fingerprints';
      case 25:
        return 'unlock by card failed—card expired';
      case 26:
        return 'lock by Bluetooth';
      case 27:
        return 'unlock by Mechanical key';
      case 28:
        return 'unlock by gateway';
      case 29:
        return 'apply some force on the Lock';
      case 30:
        return 'Door sensor closed';
      case 31:
        return 'Door sensor open';
      case 32:
        return 'open from inside';
      case 33:
        return 'lock by fingerprint';
      case 34:
        return 'lock by passcode';
      case 35:
        return 'lock by card';
      case 36:
        return 'lock by Mechanical key';
      case 37:
        return 'Remote Control';
      case 38:
        return 'unlock by passcode failed—The door has been double locked';
      case 39:
        return 'unlock by IC card failed—The door has been double locked';
      case 40:
        return 'Abrir con huella digital';
      case 41:
        return 'unlock by app failed—The door has been double locked';
      case 42:
        return 'received new local mail';
      case 43:
        return 'received new other cities\' mail';
      case 44:
        return 'Tamper alert';
      case 45:
        return 'Se cierra automáticamente al final del Modo de Paso';
      case 46:
        return 'unlock by unlock key';
      case 47:
        return 'lock by lock key';
      case 48:
        return '¡Detectados intentos de acceso no autorizados!';
      case 49:
        return 'unlock by hotel card';
      case 50:
        return 'Unlocked due to the high temperature';
      case 51:
        return 'unlock by card failed—card in blacklist';
      case 52:
        return 'Dead lock with APP';
      case 53:
        return 'Dead lock with passcode';
      case 54:
        return 'The car left (for parking lock)';
      case 55:
        return 'unlock with key fob';
      case 57:
        return 'Unlock with QR code success';
      case 58:
        return 'Unlock with QR code failed, it\'s expired';
      case 59:
        return 'Double locked';
      case 60:
        return 'Cancel double lock';
      case 61:
        return 'Lock with QR code success';
      case 62:
        return 'Lock with QR code failed, the lock is double locked';
      case 63:
        return 'Auto unlock at passage mode';
      case 64:
        return 'Door unclosed alarm';
      case 65:
        return 'Failed to unlock';
      case 66:
        return 'Failed to lock';
      case 67:
        return 'Face unlock success';
      case 68:
        return 'Face unlock failed - door locked from inside';
      case 69:
        return 'Lock with face';
      case 70:
        return 'Face registration success';
      case 71:
        return 'Face unlock failed - expired or ineffective';
      case 72:
        return 'Delete face success';
      case 73:
        return 'Clear face success';
      case 74:
        return 'IC card unlock failed - CPU secure information error';
      case 75:
        return 'App authorized button unlock success';
      case 76:
        return 'Gateway authorized button unlock success';
      case 77:
        return 'Dual authentication Bluetooth unlock verification success, waiting for second user';
      case 78:
        return 'Dual authentication password unlock verification success, waiting for second user';
      case 79:
        return 'Dual authentication fingerprint unlock verification success, waiting for second user';
      case 80:
        return 'Dual authentication IC card unlock verification success, waiting for second user';
      case 81:
        return 'Dual authentication face card unlock verification success, waiting for second user';
      case 82:
        return 'Dual authentication wireless key unlock verification success, waiting for second user';
      case 83:
        return 'Dual authentication palm vein unlock verification success, waiting for second user';
      case 84:
        return 'Palm vein unlock success';
      case 85:
        return 'Palm vein unlock success';
      case 86:
        return 'Lock with palm vein';
      case 87:
        return 'Register palm vein success';
      case 88:
        return 'Palm vein unlock failed - expired or ineffective';
      default:
        return 'Unknown type';
    }
  }
  getFullName(){return this.userService.fullNombre_usuario}
  //FUNCIONES EKEY
  congelar(ekeyID:number, user:string){
    this.popupService.token = this.tokenData.access_token;
    this.popupService.lockID = this.lockId;
    this.popupService.elementID = ekeyID;
    this.popupService.elementType = user;
    this.popupService.confirmCongelar = true;
  }
  descongelar(ekeyID:number, user:string){
    this.popupService.token = this.tokenData.access_token;
    this.popupService.lockID = this.lockId;
    this.popupService.elementID = ekeyID;
    this.popupService.elementType = user;
    this.popupService.confirmDescongelar = true;
  }
  borrarEkey(ekeyID:number){
    this.popupService.token = this.tokenData.access_token;
    this.popupService.lockID = this.lockId;
    this.popupService.elementType = 'ekey';
    this.popupService.elementID = ekeyID;
    this.popupService.confirmDelete = true;

  }
  cambiarNombreEkey(ekeyID:number){
    this.popupService.token = this.tokenData.access_token;
    this.popupService.lockID = this.lockId;
    this.popupService.elementType = 'ekey';
    this.popupService.elementID = ekeyID;
    this.popupService.cambiarNombre = true;
  }
  cambiarPeriodoEkey(ekeyID:number){
    this.popupService.token = this.tokenData.access_token;
    this.popupService.lockID = this.lockId;
    this.popupService.elementType = 'ekey';
    this.popupService.elementID = ekeyID;
    this.popupService.cambiarPeriodo = true;
  }
  crearEkey(){
    this.passcodeService.lockAlias = this.lock.lockAlias;
    this.ekeyService.token = this.tokenData.access_token;
    this.ekeyService.lockID = this.lockId
    this.router.navigate(["lock",this.lockId,"ekey"]);
  }
  Autorizar(ekeyID:number, user:string){
    this.popupService.token = this.tokenData.access_token;
    this.popupService.lockID = this.lockId;
    this.popupService.elementID = ekeyID;
    this.popupService.elementType = user;
    this.popupService.confirmAutorizar = true;
  }
  Desautorizar(ekeyID:number, user:string){
    this.popupService.token = this.tokenData.access_token;
    this.popupService.lockID = this.lockId;
    this.popupService.elementID = ekeyID;
    this.popupService.elementType = user;
    this.popupService.confirmDesautorizar = true;
  }

  //FUNCIONES PASSCODE
  crearPasscode() {
    this.passcodeService.lockAlias = this.lock.lockAlias;
    this.passcodeService.token = this.tokenData.access_token;
    this.passcodeService.lockID = this.lockId;
    this.router.navigate(["lock",this.lockId,"passcode"]);
  }
  cambiarPasscode(passcode: Passcode) {
    this.popupService.token = this.tokenData.access_token;
    this.popupService.lockID = this.lockId;
    this.popupService.elementType = 'passcode';
    this.popupService.elementID = passcode.keyboardPwdId;
    this.popupService.passcode = passcode;
    this.popupService.editarPasscode = true;
    console.log(this.popupService.passcode.keyboardPwdType);
  }
  borrarPasscode(passcodeID: number) {
    this.popupService.token = this.tokenData.access_token;
    this.popupService.lockID = this.lockId;
    this.popupService.elementType = 'passcode';
    this.popupService.elementID = passcodeID;
    this.popupService.confirmDelete = true;
  }
  //FUNCIONES CARD
  borrarCard(cardID:number){
    this.popupService.token = this.tokenData.access_token;
    this.popupService.lockID = this.lockId;
    this.popupService.elementType = 'card';
    this.popupService.elementID = cardID;
    this.popupService.confirmDelete = true;
  }
  cambiarNombreCard(cardID:number){
    this.popupService.token = this.tokenData.access_token;
    this.popupService.lockID = this.lockId;
    this.popupService.elementType = 'card';
    this.popupService.elementID = cardID;
    this.popupService.cambiarNombre = true;
  }
  cambiarPeriodoCard(cardID:number){
    this.popupService.token = this.tokenData.access_token;
    this.popupService.lockID = this.lockId;
    this.popupService.elementType = 'card';
    this.popupService.elementID = cardID;
    this.popupService.cambiarPeriodo = true;
  }
  //FUNCIONES FINGERPRINT
  borrarFingerprint(fingerID:number){
    this.popupService.token = this.tokenData.access_token;
    this.popupService.lockID = this.lockId;
    this.popupService.elementType = 'fingerprint';
    this.popupService.elementID = fingerID;
    this.popupService.confirmDelete = true;
  }
  cambiarNombreFingerprint(fingerID:number){
    this.popupService.token = this.tokenData.access_token;
    this.popupService.lockID = this.lockId;
    this.popupService.elementType = 'fingerprint';
    this.popupService.elementID = fingerID;
    this.popupService.cambiarNombre = true;
  }
  cambiarPeriodoFingerprint(fingerID:number){
    this.popupService.token = this.tokenData.access_token;
    this.popupService.lockID = this.lockId;
    this.popupService.elementType = 'fingerprint';
    this.popupService.elementID = fingerID;
    this.popupService.cambiarPeriodo = true;
  }
}

