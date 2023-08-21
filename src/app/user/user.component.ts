import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LockData, LockListResponse } from '../Interfaces/Lock';
import { EkeyServiceService } from '../services/ekey-service.service';
import { faBatteryFull, faBatteryThreeQuarters, faBatteryHalf, faBatteryQuarter, faBatteryEmpty, faGear, faWifi } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment';
import { PopUpService } from '../services/pop-up.service';
import { GroupService } from '../services/group.service';

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
  ekeyList: LockListResponse;
  lock: LockData;
  faBatteryFull = faBatteryFull
  faBatteryThreeQuarters = faBatteryThreeQuarters
  faBatteryHalf = faBatteryHalf
  faBatteryQuarter = faBatteryQuarter
  faBatteryEmpty = faBatteryEmpty
  faGear = faGear
  faWifi = faWifi

  constructor(private router: Router, public groupService: GroupService, private ekeyService: EkeyServiceService, public popupService: PopUpService) { }

  async ngOnInit() {
    this.username = localStorage.getItem('user') ?? '';
    this.password = localStorage.getItem('password') ?? '';
    this.token = localStorage.getItem('token') ?? '';
    if (this.token) {
      await this.EncontrarLocks_EkeysdelUsuario(this.token);
    }
    try {
      await this.groupService.getGroupofAccount(this.token)
      this.groupService.data$.subscribe((data) => {
        if (data?.list) { this.groupService.groups = data.list }
        else { console.log("Data not yest available") }
      })
    }
    catch (error) { console.error("Error while fetching the groups:", error)}
    this.groupService.groups.forEach(group => {
      group.lockCount = this.countLocksInGroup(group.groupId)
    })
    console.log("Groups: ", this.groupService.groups)

  }

  countLocksInGroup(groupId: number): number {
    return this.ekeyList.list.filter(lock => lock.groupId === groupId).length;
  }

  async EncontrarLocks_EkeysdelUsuario(token: string) {//locks y tambien ekeys
    try {
      await this.ekeyService.getEkeysofAccount(token);
      this.ekeyService.data2$.subscribe((data) => {
        if (data.list) {
          console.log(data.list)
          this.ekeyList = data;
        } else {
          console.log("Error en EncontrarLocks_EkeysdelUsuario (user.component.ts)");
        }
      });
    } catch (error) {
      console.error("Error while fetching eKeyList:", error);
    }
  }

  onLockButtonClick(lock: LockData) {
    localStorage.setItem('lockID', lock.lockId.toString())
    localStorage.setItem('Alias', lock.lockAlias)
    localStorage.setItem('Bateria', lock.electricQuantity.toString())
    localStorage.setItem('userType', lock.userType)
    localStorage.setItem('keyRight', lock.keyRight.toString())
    localStorage.setItem('startDate', lock.startDate)
    localStorage.setItem('endDate', lock.endDate)
    localStorage.setItem('gateway', lock.hasGateway.toString())
    this.router.navigate(['users', this.username, 'lock', lock.lockId])
  }

  onInvalidButtonClick() {
    this.popupService.invalidLock = true;
  }

  hasValidAccess(lock: LockData): boolean {
    if (Number(lock.endDate) === 0 || moment(lock.endDate).isAfter(moment())) {
      return true
    }
    else {
      return false;
    }
  }
  
}