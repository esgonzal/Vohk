import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';
import { AccessTokenData } from '../AccessToken';
import { LockServiceService } from '../services/lock-service.service';
import { LockData, LockListResponse } from '../Lock';
import { EkeyServiceService } from '../services/ekey-service.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: []
})
export class UserComponent implements OnInit {

  username: string;
  password: string;
  newPassword: string;
  newPasswordDisplay = false;
  tokenData: AccessTokenData;
  locksList: LockListResponse;
  ekeylist: LockListResponse;
  lock:LockData;

  constructor(private router: Router, public userService: UserServiceService, public lockService: LockServiceService, public ekeyService: EkeyServiceService) {}
    
  ngOnInit(){
    this.username = this.userService.getnombre_usuario();
    this.password = this.userService.getclave_usuario();
    this.userService.data$.subscribe((data) => {
      this.tokenData = data;
    });
    this.EncontrarLocksdelUsuario(this.tokenData.access_token);
    this.EncontrarLocks_EkeysdelUsuario(this.tokenData.access_token);    
  }

  async EncontrarLocks_EkeysdelUsuario(token: string){//locks y tambien ekeys
    try{
      await this.ekeyService.getEkeysofAccount(token);
      this.ekeyService.data$.subscribe((data) => {
        if (data.list) {
          this.ekeylist = data;
        } else {
          console.log("Data not yet available.");
        }
      });
    } catch(error) {
      console.error("Error while fetching access token:", error);
    }
  }

  async EncontrarLocksdelUsuario(token: string){//locks
    try{
      await this.lockService.getLockListAccount(token);
      this.lockService.data$.subscribe((data) => {
        if (data.list) {
          this.locksList = data;
        } else {
          console.log("Data not yet available.");
        }
      });
    } catch(error) {
      console.error("Error while fetching access token:", error);
    }
  }
    

  Eliminar(){
    this.userService.DeleteUser(this.username)
    this.router.navigate(['']);
  }

  ToggleDisplay(){ this.newPasswordDisplay = !this.newPasswordDisplay }

  cambiarPass(username: string, newPassword: string){
    this.userService.ResetPassword(username, newPassword);
    this.password = newPassword;
    this.router.navigate(['/login']);
  }

  onLockButtonClick(lockID: number, userType:string, keyRight:number){
    if (userType === '110301' || keyRight === 1){
      this.router.navigate(['/lock/',lockID]);
    } else{
      console.log("No tiene acceso a las funcionalidades de esta cerradura.")
    }
  }


}