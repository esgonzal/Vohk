import { Component } from '@angular/core';



@Component({
  selector: 'app-passcode',
  templateUrl: './passcode.component.html',
  styleUrls: ['./passcode.component.css'],
})
export class PasscodeComponent {

  passcodeName: string;
  passcodePwd: string;
  passcodeStartTime: string;
  passcodeEndTime: string;
  passcodeType: string;
  
  display: boolean = false;
  toggleDisplay(){this.display = !this.display;}
  displayInfo:boolean=false
  toggleInfo(){this.displayInfo = !this.displayInfo}
  displayEditar: boolean = false;
  toggleEditar() { this.displayEditar = !this.displayEditar; }

  constructor() { }


}
