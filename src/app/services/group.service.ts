import { Injectable } from '@angular/core';
import { LockServiceService } from './lock-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { Group, GroupResponse, addGroupResponse } from '../Interfaces/Group';
import { LockData } from '../Interfaces/Lock';
import { operationResponse } from '../Interfaces/Elements';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  DEFAULT_GROUP: Group = { groupId: 0, groupName: 'Todos', lockCount: 0, locks: [] };

  private dataSubject = new BehaviorSubject<any>(null);
  data$ = this.dataSubject.asObservable();
  public selectedGroupSubject = new BehaviorSubject<Group>(this.DEFAULT_GROUP);
  selectedGroup$ = this.selectedGroupSubject.asObservable();

  token = localStorage.getItem('token') ?? '';
  groups: Group[] = [];
  locksWithoutGroup: LockData[];
  selectedGroup: Group;

  constructor(private http: HttpClient, private lockService: LockServiceService) { }

  updateSelectedGroup(group: Group) {
    this.selectedGroupSubject.next(group);
  }
  getGroupofAccount(token: string): Observable<GroupResponse> {
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/group/list'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: header };
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('date', fecha.toString());
    return this.http.post<GroupResponse>(url, body.toString(), options);
  }
  addGroup(token: string, name: string): Observable<addGroupResponse> {
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/group/add'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: header };
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('name', name);
    body.set('date', fecha.toString());
    return this.http.post<addGroupResponse>(url, body.toString(), options);
  }
  deleteGroup(token: string, groupID: string): Observable<operationResponse> {
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/group/delete'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: header };
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('groupId', groupID);
    body.set('date', fecha.toString());
    return this.http.post<operationResponse>(url, body.toString(), options);
  }
  renameGroup(token: string, groupID: string, newName: string): Observable<operationResponse> {
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/group/update'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: header };
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('groupId', groupID);
    body.set('name', newName);
    body.set('date', fecha.toString());
    return this.http.post<operationResponse>(url, body.toString(), options);
  }
  async setGroupofLock(token: string, lockID: string, groupID: string) {
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/lock/setGroup'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: header };
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockID);
    body.set('groupId', groupID);
    body.set('date', fecha.toString());
    try {
      const response = await lastValueFrom(this.http.post(url, body.toString(), options))
      this.dataSubject.next(response);
      console.log(response)
    } catch (error) {
      console.error("Error while setting a group for a lock:", error)
      this.dataSubject.next(null);
    }
  }
}
