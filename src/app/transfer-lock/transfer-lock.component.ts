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

  username = localStorage.getItem('user') ?? ''
  lockId: number = Number(localStorage.getItem('lockID') ?? '')
  recieverUsername: string;

  async transferir() {
    let lockIDList: string = "[".concat(this.lockId.toString()).concat("]");
    await this.lockService.transferLock(this.lockService.token, this.recieverUsername, lockIDList)
    this.router.navigate(["users", this.username]);
  }
}
