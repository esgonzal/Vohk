import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopUpService {

  confirmRegister=false;
  confirmDelete=false;
  welcomingMessage:string;
  token:string;
  lockID:number;
  elementType:string;
  elementID:number

  constructor() { }
}
