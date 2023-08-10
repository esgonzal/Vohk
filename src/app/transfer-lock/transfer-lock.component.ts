import { Component } from '@angular/core';
import { LockServiceService } from '../services/lock-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transfer-lock',
  templateUrl: './transfer-lock.component.html',
  styleUrls: ['./transfer-lock.component.css']
})
export class TransferLockComponent {

  constructor(private lockService: LockServiceService, private router: Router) { }

  recieverUsername: string;

  async transferir() {
    let lockID: number = this.lockService.lockID;
    let lockIDList: string = "[".concat(lockID.toString()).concat("]");
    await this.lockService.transferLock(this.lockService.token, this.recieverUsername, lockIDList)
    this.router.navigate(["lock", this.lockService.lockID]);
  }
}
