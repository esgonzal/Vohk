import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../services/user-service.service';
import { LockServiceService } from '../services/lock-service.service';
import { LockData } from '../Lock';
import { ActivatedRoute, Router } from '@angular/router';
import { AccessTokenData } from '../AccessToken';
import { PasscodeServiceService } from '../services/passcode-service.service';
import { Passcode, PasscodeFormulario } from '../Passcode';
import {MatExpansionModule} from '@angular/material/expansion';



@Component({
  selector: 'app-passcode',
  templateUrl: './passcode.component.html',
  styleUrls: ['./passcode.component.css'],
})
export class PasscodeComponent implements OnInit {

  lockId: number;
  tokenData: AccessTokenData;
  lock: LockData;
  passcodes: Passcode[] = []
  passcodeName: string;
  passcodePwd: string;
  passcodeStartTime: string;
  passcodeEndTime: string;
  passcodeType: string;
  //////////////
  display: boolean = false;
  toggleDisplay(){this.display = !this.display;}
  displayInfo:boolean=false
  toggleInfo(){this.displayInfo = !this.displayInfo}
  displayEditar: boolean = false;
  toggleEditar() { this.displayEditar = !this.displayEditar; }
  
  selectedType = '';
  onSelected(value: string): void {
    this.selectedType = value;
  }

  selectedPasscode: Passcode;
  onSelectedPasscode(pass: Passcode): void{
    this.selectedPasscode = pass;
  }

  ambasFunciones(pass: Passcode){
    this.toggleInfo();
    this.onSelectedPasscode(pass);
  }

  constructor(private route: ActivatedRoute,
    private router: Router,
    public userService: UserServiceService,
    public lockService: LockServiceService,
    public passcodeService: PasscodeServiceService
  ) { }

  async ngOnInit(): Promise<void> {
    //Get the lockId and lock
    // Get the lockId from route parameters 
    this.route.paramMap.subscribe(params => {
      this.lockId = Number(params.get('id'));
      // Use lockId to get the specific lock data
      this.lockService.data$.subscribe((data) => {
        if (data.list) {
          this.lock = data.list.find((lock: { lockId: number; }) => lock.lockId === this.lockId);
          if (!this.lock) {
            // Handle case when the lock with the specified lockId is not found
            this.router.navigate(['/not-found']);
          }
        } else {
          console.log("Data not yet available(ngOnInit de lock component).");
        }
      });
    });
    //Get the Access Token
    // Subscribe to the user data
    this.userService.data$.subscribe((data) => {
      this.tokenData = data;
    });
    try {
      await this.passcodeService.getPasscodesofLock(this.tokenData.access_token, this.lockId);
      this.passcodeService.data$.subscribe((data) => {
        if (data?.list) {
          this.passcodes = data.list;
        } else {
          console.log("Data not yet available.");
          this.passcodes = this.passcodes;
        }
      });
    } catch (error) {
      console.error("Error while fetching the passcode:", error);
    }
  }

  async crearPasscode(type: string, datos: PasscodeFormulario) {
    if (datos.passcodePwd) {//SI EXISTE CONTRASEÑA, ENTONCES ES CUSTOM
      await this.passcodeService.generateCustomPasscode(this.tokenData.access_token, this.lockId, datos.passcodePwd, datos.passcodeName, type, datos.passcodeStartTime, datos.passcodeEndTime)
      this.router.navigate(["lock", this.lockId]);
    } else {//ES CONTRASEÑA RANDOM
      await this.passcodeService.generatePasscode(this.tokenData.access_token, this.lockId, type, datos.passcodeName, datos.passcodeStartTime, datos.passcodeEndTime)
      this.router.navigate(["lock", this.lockId]);
    }
  }

  async editarPasscode(passcode: Passcode, datos: PasscodeFormulario) {
    await this.passcodeService.changePasscode(passcode, this.tokenData.access_token, this.lockId, passcode.keyboardPwdId, datos.passcodeName, datos.passcodePwd, datos.passcodeStartTime, datos.passcodeEndTime);
    this.router.navigate(["lock", this.lockId]);
  }

  async borrarPasscode(passcodeID: number) {
    await this.passcodeService.deletePasscode(this.tokenData.access_token, this.lockId, passcodeID)
    this.router.navigate(["lock", this.lockId]);
  }

  async enviarPasscode(){
    
  }

}
