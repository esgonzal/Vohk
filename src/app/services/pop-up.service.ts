import { Injectable } from '@angular/core';
import { Passcode } from '../Interfaces/Elements';
import { LockDetails } from '../Interfaces/Lock';
import { GatewayAccount, GatewayLock } from '../Interfaces/Gateway';

@Injectable({
  providedIn: 'root'
})
export class PopUpService {

  registro = false;
  delete = false;
  autorizar = false;
  desautorizar = false;
  autorizarFalso = false;
  desautorizarFalso = false;
  congelar = false;
  descongelar = false;
  cambiarNombre = false;
  cambiarPeriodo = false;
  editarPasscode = false;
  esencial = false;
  gateway = false;
  mostrarHora = false;
  cerradoAutomatico = false;
  needGateway = false;
  invalidLock = false;
  gatewaysOfLock: GatewayLock[]
  gatewaysOfAccount: GatewayAccount[]
  detalles: LockDetails;
  welcomingMessage: string;
  token: string;
  lockID: number;
  elementType: string;
  elementID: number;
  passcode: Passcode;

  constructor() { }
}
