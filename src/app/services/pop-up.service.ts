import { Injectable } from '@angular/core';
import { Passcode } from '../Interfaces/Elements';
import { LockData, LockDetails } from '../Interfaces/Lock';
import { GatewayAccount, GatewayLock } from '../Interfaces/Gateway';

@Injectable({
  providedIn: 'root'
})
export class PopUpService {

  confirmRegister = false;
  confirmDelete = false;
  confirmAutorizar = false;
  confirmDesautorizar = false;
  confirmCongelar = false;
  confirmDescongelar = false;
  cambiarNombre = false;
  cambiarPeriodo = false;
  editarPasscode = false;
  Esencial = false;
  Gateway = false;
  mostrarHora = false;
  cerradoAutomatico = false;
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
