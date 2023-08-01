import { Component } from '@angular/core';

@Component({
  selector: 'app-fingerprint',
  templateUrl: './fingerprint.component.html',
  styleUrls: ['./fingerprint.component.css']
})
export class FingerprintComponent {

  fingerprintName:string;
  fingerprintStartTime: string;
  fingerprintEndTime: string;

  constructor(){}

  displayEditarNombre = false;
  toggleEditarNombre(){this.displayEditarNombre = !this.displayEditarNombre;}
  displayEditarPeriodo = false
  toggleEditarPeriodo(){this.displayEditarPeriodo = !this.displayEditarPeriodo}
}
