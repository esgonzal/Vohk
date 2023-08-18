import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { LockServiceService } from './lock-service.service';
@Injectable({
  providedIn: 'root'
})
export class EkeyServiceService {

  private dataSubject = new BehaviorSubject<any>(null);
  data$ = this.dataSubject.asObservable();
  private dataSubject2 = new BehaviorSubject<any>(null);
  data2$ = this.dataSubject2.asObservable();

  token: string;
  lockID: number;
  endDateUser: string;
  ekeysimple = false;

  constructor(private lockService:LockServiceService, private http:HttpClient) { }

  async getEkeysofAccount(token:string){
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/key/list'
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
      this.dataSubject2.next(response);
    } catch (error) {
      console.error("Error while getting the list of Ekeys of an account:", error);
      this.dataSubject2.next(null); 
    }
  }

  async getEkeysofLock(token:string, lockID:number){
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/lock/listKey'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'});
    let options = { headers: header};
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockID.toString());
    body.set('pageNo', '1');
    body.set('pageSize', '20');
    body.set('date', fecha);
    try {
      const response = await lastValueFrom(this.http.post(url, body.toString(), options));
      this.dataSubject.next(response); // Emit the response to dataSubject
    } catch (error) {
      console.error("Error while getting the list of Ekeys of a lock:", error);
      this.dataSubject.next(null); // Emit null to dataSubject on error
    }
  }

  async sendEkey(token:string, lockID:number, recieverName:string, keyName:string, startDate:string, endDate:string, keyRight:number, keyType?:number, startDay?:string, endDay?:string, weekDays?:string){
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/key/send'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'});
    let options = { headers: header};
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockID.toString());
    body.set('receiverUsername', recieverName);
    body.set('keyName', keyName);
    body.set('startDate', startDate);
    body.set('endDate', endDate);
    body.set('date', fecha);
    body.set('keyRight', keyRight.toString());
    if (keyType !== undefined) {
      body.set('keyType', keyType.toString());
    }
    if (startDay !== undefined) {
      body.set('startDay', startDay);
    }
    if (endDay !== undefined) {
      body.set('endDay', endDay);
    }
    if (weekDays !== undefined) {
      body.set('weekDays', weekDays);
    }
    try {
      const response = await lastValueFrom(this.http.post(url, body.toString(), options));
      this.dataSubject.next(response); // Emit the response to dataSubject
      console.log(response);
    } catch (error) {
      console.error("Error while sending a Ekey:", error);
      this.dataSubject.next(null); // Emit null to dataSubject on error
    }
    
  }

  async deleteEkey(token:string, keyID:number){
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/key/delete'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'});
    let options = { headers: header};
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('keyId', keyID.toString());
    body.set('date', fecha);
    try {
      const response = await lastValueFrom(this.http.post(url, body.toString(), options));
      this.dataSubject.next(response);
      console.log(response)
    } catch (error) {
      console.error("Error while deleting a Ekey:", error);
      this.dataSubject.next(null); // Emit null to dataSubject on error
    }
  }

  async freezeEkey(token:string, keyID:number){
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/key/freeze'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'});
    let options = { headers: header};
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('keyId', keyID.toString());
    body.set('date', fecha);
    try {
      const response = await lastValueFrom(this.http.post(url, body.toString(), options));
      this.dataSubject.next(response);
      console.log(response)
    } catch (error) {
      console.error("Error while freezing a Ekey:", error);
      this.dataSubject.next(null); // Emit null to dataSubject on error
    }
  }

  async unfreezeEkey(token:string, keyID:number){
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/key/unfreeze'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'});
    let options = { headers: header};
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('keyId', keyID.toString());
    body.set('date', fecha);
    try {
      const response = await lastValueFrom(this.http.post(url, body.toString(), options));
      this.dataSubject.next(response); 
      console.log(response)
    } catch (error) {
      console.error("Error while unfreezing a Ekey:", error);
      this.dataSubject.next(null); // Emit null to dataSubject on error
    }
  }

  async modifyEkey(token:string, ekeyID:number, newName?:string, remoteEnable?:string ){
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/key/update'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'});
    let options = { headers: header};
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('keyId', ekeyID.toString());
    body.set('date', fecha);
    if(newName !== undefined){
      body.set('keyName', newName);
    }
    if (remoteEnable !== undefined){
      body.set('remoteEnable', remoteEnable);
    }
    try {
      const response = await lastValueFrom(this.http.post(url, body.toString(), options));
      this.dataSubject.next(response);
      console.log(response)
    } catch (error) {
      console.error("Error while modifying a Ekey:", error);
      this.dataSubject.next(null); // Emit null to dataSubject on error
    }
  }

  async changePeriod(token:string, ekeyID:number, newStartDate:string, newEndDate:string){
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/key/changePeriod'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'});
    let options = { headers: header};
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('keyId', ekeyID.toString());
    body.set('startDate', newStartDate);
    body.set('endDate', newEndDate);
    body.set('date', fecha);
    try {
      const response = await lastValueFrom(this.http.post(url, body.toString(), options));
      this.dataSubject.next(response);
      console.log(response)
    } catch (error) {
      console.error("Error while changing the validity period of the fingerprint:", error);
      this.dataSubject.next(null); // Emit null to dataSubject on error
    }
  }

  async AuthorizeEkey(token:string, lockID:number, keyID:number){
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/key/authorize'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'});
    let options = { headers: header};
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockID.toString());
    body.set('keyId', keyID.toString());
    body.set('date', fecha);
    try {
      const response = await lastValueFrom(this.http.post(url, body.toString(), options));
      this.dataSubject.next(response);
      console.log(response)
    } catch (error) {
      console.error("Error while authorizing a Ekey:", error);
      this.dataSubject.next(null); // Emit null to dataSubject on error
    }
  }

  async cancelAuthorizeEkey(token:string, lockID:number, keyID:number){
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/key/unauthorize'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'});
    let options = { headers: header};
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockID.toString());
    body.set('keyId', keyID.toString());
    body.set('date', fecha);
    try {
      const response = await lastValueFrom(this.http.post(url, body.toString(), options));
      this.dataSubject.next(response); 
      console.log(response)
    } catch (error) {
      console.error("Error while authorizing a Ekey:", error);
      this.dataSubject.next(null); // Emit null to dataSubject on error
    }
  }
}
