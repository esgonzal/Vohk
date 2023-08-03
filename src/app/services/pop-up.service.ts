import { Injectable } from '@angular/core';
import { Passcode } from '../Passcode';

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
  welcomingMessage: string;
  token: string;
  lockID: number;
  elementType: string;
  elementID: number;
  passcode: Passcode;

  constructor() { }
}
