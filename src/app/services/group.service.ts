import { Injectable } from '@angular/core';
import { LockServiceService } from './lock-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { Group } from '../Interfaces/Group';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  
  private dataSubject = new BehaviorSubject<any>(null);
  data$ = this.dataSubject.asObservable();
  token = localStorage.getItem('token') ?? '';
  groups: Group[] = [];
  seleccionado = 'Todos'

  constructor(private http:HttpClient, private lockService: LockServiceService) { }

  async getGroupofAccount(token:string) {
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/group/list'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'});
    let options = { headers: header};
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('date', fecha.toString());
    try {
      const response = await lastValueFrom(this.http.post(url, body.toString(), options))
      this.dataSubject.next(response);
    } catch (error) {
      console.error("Error while getting the list of groups of an account:", error)
      this.dataSubject.next(null);
    }
  }

  async addGroup(token:string, name:string) {
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/group/add'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'});
    let options = { headers: header};
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('name', name);
    body.set('date', fecha.toString());
    try {
      const response = await lastValueFrom(this.http.post(url, body.toString(), options))
      this.dataSubject.next(response);
      console.log(response)
    } catch (error) {
      console.error("Error while adding a new group:", error)
      this.dataSubject.next(null);
    }
  }

  async deleteGroup(token:string, groupID:string) {
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/group/delete'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'});
    let options = { headers: header};
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('groupId', groupID);
    body.set('date', fecha.toString());
    try {
      const response = await lastValueFrom(this.http.post(url, body.toString(), options))
      this.dataSubject.next(response);
      console.log(response)
    } catch (error) {
      console.error("Error while deleting a group:", error)
      this.dataSubject.next(null);
    }
  }

  async renameGroup(token:string, groupID:string, newName:string) {
      let fecha = this.lockService.timestamp()
      let url = 'https://euapi.ttlock.com/v3/group/update'
      let header = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'});
      let options = { headers: header};
      let body = new URLSearchParams();
      body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
      body.set('accessToken', token);
      body.set('groupId', groupID);
      body.set('name', newName);
      body.set('date', fecha.toString());
      try {
        const response = await lastValueFrom(this.http.post(url, body.toString(), options))
        this.dataSubject.next(response);
        console.log(response)
      } catch (error) {
        console.error("Error while renaming a group:", error)
        this.dataSubject.next(null);
      }
  }

  async setGroupofLock(token:string, lockID:string, groupID:string) {
    let fecha = this.lockService.timestamp()
      let url = 'https://euapi.ttlock.com/v3/lock/setGroup'
      let header = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'});
      let options = { headers: header};
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
