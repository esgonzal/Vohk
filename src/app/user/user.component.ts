import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';
import { AccessTokenData } from '../AccessToken';
import { LockServiceService } from '../services/lock-service.service';
import { LockData, LockListResponse } from '../Lock';
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
  tokenData: AccessTokenData;
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
    this.username = this.userService.getnombre_usuario();
    this.password = this.userService.getclave_usuario();
    this.userService.data$.subscribe((data) => {
      this.tokenData = data;
    });
    await this.EncontrarLocksdelUsuario(this.tokenData.access_token);
    await this.EncontrarLocks_EkeysdelUsuario(this.tokenData.access_token);    
  }

  async EncontrarLocks_EkeysdelUsuario(token: string){//locks y tambien ekeys
    try{
      await this.ekeyService.getEkeysofAccount(token);
      this.ekeyService.data2$.subscribe((data) => {
        if (data.list) {
          this.ekeyList = data;
        } else {
          console.log("Data not yet available.");
        }
      });
    } catch(error) {
      console.error("Error while fetching eKeyList:", error);
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
      console.error("Error while fetching lockList:", error);
    }
  }

  onLockButtonClick(lockID: number){this.router.navigate(['/lock/',lockID])}
}