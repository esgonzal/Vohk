import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import moment from 'moment';
import { AccessTokenData } from '../AccessToken';
import { LockData } from '../Interfaces/Lock';


@Injectable({
  providedIn: 'root'
})
export class LockServiceService {

  private dataSubject = new BehaviorSubject<any>(null);
  data$ = this.dataSubject.asObservable();
  
  constructor(private http:HttpClient) { }

  public timestamp(){
    let timeInShanghai = moment().tz('Asia/Shanghai').valueOf();
    return timeInShanghai;
  }

  async getLockListAccount(token: string){
    let fecha = this.timestamp()
    let url = 'https://euapi.ttlock.com/v3/lock/list'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'});
    let options = { headers: header};
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('pageNo', '1');
    body.set('pageSize', '20');
    body.set('date', fecha.toString());
    try {
      const response = await lastValueFrom(this.http.post(url, body.toString(), options));
      this.dataSubject.next(response);
    } catch (error) {
      console.error("Error while fetching lock list of the account:", error);
      this.dataSubject.next(null); // Emit null to dataSubject on error
    }
  }

  async getLockDetails(token:string, lockId:number){
    let fecha = this.timestamp()
    let url = 'https://euapi.ttlock.com/v3/lock/detail'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'});
    let options = { headers: header};
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockId.toString());
    body.set('date', fecha.toString());
    try{
      const response = await lastValueFrom(this.http.post(url, body.toString(), options));
      this.dataSubject.next(response);
    } catch (error){
      console.error("Error while fetching lock details:", error);
      this.dataSubject.next(null); // Emit null to dataSubject on error
    }
  }

  async changeLockName(token:string, lockId:number, newLockAlias: string){
    let fecha = this.timestamp()
    let url = 'https://euapi.ttlock.com/v3/lock/rename'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'});
    let options = { headers: header};
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockId.toString());
    body.set('lockAlias', newLockAlias);
    body.set('date', fecha.toString());
    try {
      await lastValueFrom(this.http.post(url, body.toString(), options));
    } catch (error) {
      console.error("Error while changing name of a lock:", error);
      this.dataSubject.next(null); // Emit null to dataSubject on error
      throw new Error("Lock alias update failed.");
    }
  }

  async getPassageModeConfig(token:string, lockId:number){
    let fecha = this.timestamp()
    let url = 'https://euapi.ttlock.com/v3/lock/getPassageModeConfig'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'});
    let options = { headers: header};
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockId.toString());
    body.set('date', fecha.toString());
    try{
      const response = await lastValueFrom(this.http.post(url, body.toString(), options));
      this.dataSubject.next(response);
    } catch (error){
      console.error("Error while fetching passage mode configurations:", error);
      this.dataSubject.next(null); // Emit null to dataSubject on error
    }
  }
  

}
