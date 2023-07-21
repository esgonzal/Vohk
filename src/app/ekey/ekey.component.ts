import { Component, OnInit } from '@angular/core';
import { AccessTokenData } from '../AccessToken';
import { LockData } from '../Lock';
import { ActivatedRoute, Router } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';
import { LockServiceService } from '../services/lock-service.service';
import { EkeyServiceService } from '../services/ekey-service.service';
import { Ekey } from '../Ekey';

@Component({
  selector: 'app-ekey',
  templateUrl: './ekey.component.html',
  styleUrls: ['./ekey.component.css']
})
export class EkeyComponent implements OnInit{

  lockId: number;
  tokenData: AccessTokenData;
  lock: LockData;
  ekeys: Ekey[] = []
  keyName: string;
  remoteEnable:string;
  recieverName:string;
  ekeyStartTime:string;
  ekeyEndTime:string;
  displayModificar: boolean =false
  displayEditarPeriodo: boolean=false
  displaySend: boolean =false;
  displayAuth: boolean=false
  toggleModificar(){this.displayModificar = !this.displayModificar}
  toggleEditarPeriodo(){this.displayEditarPeriodo = !this.displayEditarPeriodo}
  toggleSend(){this.displaySend = !this.displaySend}
  toggleAuth(){this.displayAuth = !this.displayAuth}

  constructor(private route:ActivatedRoute,
    private router: Router,
    public userService: UserServiceService,
    public lockService: LockServiceService,
    public ekeyService: EkeyServiceService
    ){}

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
    try{
      await this.ekeyService.getEkeysofLock(this.tokenData.access_token, this.lockId);
      this.ekeyService.data$.subscribe((data) => {
        if(data?.list) {
          this.ekeys = data.list;
        }else {
          console.log("Data not yet available.");
          this.ekeys = this.ekeys
        }
      });
    } catch(error) {
      console.error("Error while fetching the passcode:", error);
    }
  }

}
