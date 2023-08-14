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

  username: string;
  password: string;
  newPassword: string;
  newPasswordDisplay = false;
  token: string;
  //tokenData: AccessTokenData;
  //locksList: LockListResponse;
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
    this.username = localStorage.getItem('user') ?? ''; 
    this.password = localStorage.getItem('password') ?? ''; 
    this.token = localStorage.getItem('token') ?? ''; 
    if(this.token){
      await this.EncontrarLocks_EkeysdelUsuario(this.token);
    }    
  }

  async EncontrarLocks_EkeysdelUsuario(token: string){//locks y tambien ekeys
    try{
      await this.ekeyService.getEkeysofAccount(token);
      this.ekeyService.data2$.subscribe((data) => {
        if (data.list) {
          console.log(data.list)
          this.ekeyList = data;
        } else {
          console.log("Error en EncontrarLocks_EkeysdelUsuario (user.component.ts)");
        }
      });
    } catch(error) {
      console.error("Error while fetching eKeyList:", error);
    }
  }

  onLockButtonClick(lock:LockData){
    localStorage.setItem('Alias', lock.lockAlias)
    localStorage.setItem('Bateria', lock.electricQuantity.toString())
    localStorage.setItem('userType', lock.userType)
    localStorage.setItem('keyRight', lock.keyRight.toString())
    localStorage.setItem('startDate', lock.startDate)
    localStorage.setItem('endDate', lock.endDate)
    this.router.navigate(['/lock/',lock.lockId])
  }
}