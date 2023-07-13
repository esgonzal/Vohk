import { Component, OnInit } from '@angular/core';
import { Lock } from '../Lock';
import { Chapas} from "../mock-locks";


@Component({
  selector: 'app-lock-list',
  templateUrl: './lock-list.component.html',
  styleUrls: ['./lock-list.component.css']
})
export class LockListComponent implements OnInit {

  listaChapas = Chapas;

  constructor() { }

  ngOnInit(): void {
  }
  
  getlockSound(chapa: Lock){
    if(chapa.lockSound == 1){
      return true;
    }
    else return false;
  }

  
  selectedChapa?: Lock;
  
  OnSelect(chapa: Lock): void {
  this.selectedChapa = chapa;
  }

}
