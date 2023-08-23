import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LockData, LockListResponse } from '../Interfaces/Lock';
import { EkeyServiceService } from '../services/ekey-service.service';
import { faBatteryFull, faBatteryThreeQuarters, faBatteryHalf, faBatteryQuarter, faBatteryEmpty, faGear, faWifi } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment';
import { PopUpService } from '../services/pop-up.service';
import { GroupService } from '../services/group.service';
import { Subscription, lastValueFrom } from 'rxjs';
import { Group, GroupResponse } from '../Interfaces/Group';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: []
})
export class UserComponent implements OnInit {

  username = localStorage.getItem('user') ?? '';
  password = localStorage.getItem('password') ?? '';
  newPassword: string;
  newPasswordDisplay = false;
  token = localStorage.getItem('token') ?? '';
  ekeyList: LockListResponse;
  locks: LockData[] = [];
  locksWithoutGroup: LockData[] = [];
  groups: Group[] = [];
  faBatteryFull = faBatteryFull
  faBatteryThreeQuarters = faBatteryThreeQuarters
  faBatteryHalf = faBatteryHalf
  faBatteryQuarter = faBatteryQuarter
  faBatteryEmpty = faBatteryEmpty
  faGear = faGear
  faWifi = faWifi
  private selectedGroupSubscription: Subscription;

  constructor(private router: Router, public groupService: GroupService, private ekeyService: EkeyServiceService, public popupService: PopUpService) { }

  async ngOnInit() {
    await this.fetchGroups();
    await this.getLocksWithoutGroup();
    this.groupService.selectedGroupSubject.subscribe(selectedGroup => {
      if (selectedGroup) {
        this.fetchLocks(selectedGroup.groupId);
      }
    });
    this.groupService.groups = this.groups;
    this.groupService.locksWithoutGroup = this.locksWithoutGroup;
  }
  ngOnDestroy() {
    if (this.selectedGroupSubscription) {
      this.selectedGroupSubscription.unsubscribe();
    }
  }
  async fetchLocks(groupId: number) {
    try {
      await this.fetchLocksPage(1, groupId);
    } catch (error) {
      console.error("Error while fetching Locks: ", error);
    }
  }
  async fetchLocksPage(pageNo: number, groupId?: number) {
    this.locks = [];
    try {
      const response = await lastValueFrom(this.ekeyService.getEkeysofAccount(this.token, pageNo, 100, groupId));
      const typedResponse = response as LockListResponse;
      if (typedResponse?.list) {
        this.locks.push(...typedResponse.list);
        if (typedResponse.pages > pageNo) {
          await this.fetchLocksPage(pageNo + 1, groupId);
        }
      } else {
        console.log("Locks not yet available")
      }
    } catch (error) {
      console.error("Error while fetching locks page:", error)
    }
  }
  async fetchGroups() {
    try {
      const response = await lastValueFrom(this.groupService.getGroupofAccount(this.token));
      const typedResponse = response as GroupResponse;
      if (typedResponse?.list) {
        this.groups = typedResponse.list;
        // Fetch locks and calculate lock counts for each group
        for (const group of this.groups) {
          group.lockCount = await this.calculateLockCountForGroup(group);
        }
      } else {
        console.log("Groups not yet available");
      }
    } catch (error) {
      console.error("Error while fetching groups:", error);
    }
  }
  async calculateLockCountForGroup(group: Group): Promise<number> {
    let lockCount = 0;
    let pageNo = 1;
    const pageSize = 100;
    group.locks = [];
    while (true) {
      const locksResponse = await lastValueFrom(this.ekeyService.getEkeysofAccount(this.token, pageNo, pageSize, group.groupId));
      const locksTypedResponse = locksResponse as LockListResponse;
      if (locksTypedResponse?.list && locksTypedResponse.list.length > 0) {
        lockCount += locksTypedResponse.list.length;
        group.locks.push(...locksTypedResponse.list);
        if (locksTypedResponse.pages > pageNo) {
          pageNo++;
        } else {
          break; // No more pages to fetch
        }
      } else {
        break; // No more locks to fetch
      }
    }
    return lockCount;
  }
  async getLocksWithoutGroup() {
    let pageNo = 1;
    const pageSize = 100;
    while (true) {
      const locksResponse = await lastValueFrom(this.ekeyService.getEkeysofAccount(this.token, pageNo, pageSize, 0));
      const locksTypedResponse = locksResponse as LockListResponse;
      if (locksTypedResponse?.list) {
        this.locksWithoutGroup.push(...locksTypedResponse.list.filter(lock => !lock.groupId))
        if (locksTypedResponse.pages > pageNo) {
          pageNo++;
        } else {
          break; // No more pages to fetch
        }
      } else {
        break; // No more locks to fetch
      }
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