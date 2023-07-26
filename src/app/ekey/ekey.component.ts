import { Component, OnInit } from '@angular/core';
import { AccessTokenData } from '../AccessToken';
import { LockData } from '../Lock';
import { ActivatedRoute, Router } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';
import { LockServiceService } from '../services/lock-service.service';
import { EkeyServiceService } from '../services/ekey-service.service';
import { Ekey, EkeyFormulario } from '../Ekey';

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
  //////////////
  displayInfo:boolean=false
  toggleInfo(){this.displayInfo = !this.displayInfo}
  displayModificar: boolean =false
  toggleModificar(){this.displayModificar = !this.displayModificar}
  displayEditarPeriodo: boolean=false
  toggleEditarPeriodo(){this.displayEditarPeriodo = !this.displayEditarPeriodo}
  displaySend: boolean =false;
  toggleSend(){this.displaySend = !this.displaySend}
  displayAuth: boolean=false
  toggleAuth(){this.displayAuth = !this.displayAuth}

  selectedEkey: Ekey;
  onSelectedEkey(ekey: Ekey){
    this.selectedEkey = ekey
  }

  ambasFunciones(key:Ekey){
    this.toggleInfo();
    this.onSelectedEkey(key);
  }

  constructor(private route:ActivatedRoute,
    private router: Router,
    public userService: UserServiceService,
    public lockService: LockServiceService,
    public ekeyService: EkeyServiceService
    ){}

  async ngOnInit(): Promise<void> {
    this.route.paramMap.subscribe(params => {
      this.lockId = Number(params.get('id'));
      this.lockService.data$.subscribe((data) => {
        if (data.list) {
          this.lock = data.list.find((lock: { lockId: number; }) => lock.lockId === this.lockId);
          if (!this.lock) {
            this.router.navigate(['/not-found']);
          }
        } else {
          console.log("Data not yet available(ngOnInit de lock component).");
        }
      });
    });
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

  async congelarEkey(ekeyID:number){
    await this.ekeyService.freezeEkey(this.tokenData.access_token, ekeyID);
    this.router.navigate(["lock", this.lockId]);
  }

  async descongelarEkey(ekeyID:number){
    await this.ekeyService.unfreezeEkey(this.tokenData.access_token, ekeyID);
    this.router.navigate(["lock", this.lockId]);
  }

  async borrarEkey(ekeyID:number){
    await this.ekeyService.deleteEkey(this.tokenData.access_token, ekeyID);
    this.router.navigate(["lock", this.lockId]);
  }

  async editarNameEkey(ekeyID:number, datos:EkeyFormulario){
    await this.ekeyService.modifyEkey(this.tokenData.access_token, ekeyID, datos.keyName, datos.remoteEnable);
    this.router.navigate(["lock", this.lockId]);
  }
  async editarPeriodEkey(ekeyID:number, datos:EkeyFormulario){
    await this.ekeyService.changePeriod(this.tokenData.access_token, ekeyID, datos.ekeyStartTime, datos.ekeyEndTime);
    this.router.navigate(["lock", this.lockId]);
  }

  async enviarEkey(datos:EkeyFormulario){
    await this.ekeyService.sendEkey(this.tokenData.access_token, this.lockId, datos.recieverName, datos.keyName, datos.ekeyStartTime, datos.ekeyEndTime);
    this.router.navigate(["lock", this.lockId]);
  }
}
