import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { operationResponse } from 'src/app/Interfaces/API_responses';
import { LockServiceService } from 'src/app/services/lock-service.service';
import { PopUpService } from 'src/app/services/pop-up.service';
import { UserServiceService } from 'src/app/services/user-service.service';

@Component({
  selector: 'app-transfer-lock',
  templateUrl: './transfer-lock.component.html',
  styleUrls: ['./transfer-lock.component.css']
})
export class TransferLockComponent {

  constructor(private userService: UserServiceService, public popupService: PopUpService, private lockService: LockServiceService, private router: Router) { }

  error: string = '';
  username = localStorage.getItem('user') ?? ''
  lockId: number = Number(localStorage.getItem('lockID') ?? '')
  recieverUsername: string;
  isLoading: boolean;

  async transferir() {
    this.isLoading = true;
    try {
      let lockID = localStorage.getItem('lockID') ?? ''
      let lockIDList: string = "[".concat(lockID).concat("]");
      let response = await lastValueFrom(this.lockService.transferLock(this.lockService.token, this.recieverUsername, lockIDList)) as operationResponse;
      if (response.errcode === 0) {
        this.router.navigate(["users", localStorage.getItem('user') ?? '']);
        console.log("La cerradura se transfirió a la cuenta TTLock exitosamente")
        localStorage.setItem(this.recieverUsername, '0')
      } else if (response.errcode === -1002) {
        let encode = this.userService.customBase64Encode(this.recieverUsername);
        response = await lastValueFrom(this.lockService.transferLock(this.lockService.token, 'bhaaa_'.concat(encode), lockIDList)) as operationResponse;
        if (response.errcode == 0) {
          this.router.navigate(["users", localStorage.getItem('user') ?? '']);
          console.log("La cerradura se transfirió a la cuenta VOHK exitosamente")
          localStorage.setItem(this.recieverUsername, '0')
        } else if (response.errcode === -1002) {
          this.error = 'El receptor ingresado no tiene una cuenta registrada.'
        } else {
          console.log(response)
        }
      } else {
        console.log(response)
      }
    } catch (error) {
      console.error("Error while transfering a lock:", error);
    } finally {
      this.isLoading = false;
    }
  }
}
