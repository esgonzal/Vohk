import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';
import { AccessTokenData } from '../Interfaces/AccessToken';
import { LockServiceService } from '../services/lock-service.service';
import { LockData, LockListResponse } from '../Interfaces/Lock';
import { EkeyServiceService } from '../services/ekey-service.service';
import { faBatteryFull,faBatteryThreeQuarters,faBatteryHalf,faBatteryQuarter,faBatteryEmpty, faGear} from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: []
})
export class UserComponent implements OnInit {

  username = localStorage.getItem('user');
  password = localStorage.getItem('password');
  newPassword: string;
  newPasswordDisplay = false;
  token = localStorage.getItem('token') ?? ''; 
  //tokenData: AccessTokenData;
  locksList: LockListResponse;
  ekeyList: LockListResponse;
  lock:LockData;
  faBatteryFull= faBatteryFull
  faBatteryThreeQuarters= faBatteryThreeQuarters
  faBatteryHalf= faBatteryHalf
  faBatteryQuarter= faBatteryQuarter
  faBatteryEmpty= faBatteryEmpty
  faGear= faGear

  constructor(private router: Router, public userService: UserServiceService, public lockService: LockServiceService, public ekeyService: EkeyServiceService) {}
    
  async ngOnInit(){
    //await this.EncontrarLocksdelUsuario(this.tokenData.access_token);
    await this.EncontrarLocks_EkeysdelUsuario(this.token);    
  }

  async EncontrarLocks_EkeysdelUsuario(token: string){//locks y tambien ekeys
    try{
      await this.ekeyService.getEkeysofAccount(token);
      this.ekeyService.data2$.subscribe((data) => {
        if (data.list) {
          this.ekeyList = data;
        } else {
          console.log("Error en EncontrarLocks_EkeysdelUsuario (user.component.ts)");
        }
      });
    } catch(error) {
      console.error("Error while fetching eKeyList:", error);
    }
  }

  /*async EncontrarLocksdelUsuario(token: string){//locks
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
      console.error("Error while fetching lockList:", error);
    }
  }*/

  onLockButtonClick(lockID: number, lockAlias:string, electricQuantity:number, userType:string, keyRight:number){
    localStorage.setItem('Alias', lockAlias)
    localStorage.setItem('Bateria', electricQuantity.toString())
    localStorage.setItem('userType', userType)
    localStorage.setItem('keyRight', keyRight.toString())
    this.router.navigate(['/lock/',lockID])
  }
}