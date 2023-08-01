import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopUpService {

  confirmRegister=false;
  confirmDelete=false;
  cambiarNombre=false;
  cambiarPeriodo=false;
  welcomingMessage:string;
  token:string;
  lockID:number;
  elementType:string;
  elementID:number;

  constructor() { }
}
