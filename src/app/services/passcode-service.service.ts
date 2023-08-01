import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import moment from 'moment';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { Passcode } from '../Passcode';

@Injectable({
  providedIn: 'root'
})
export class PasscodeServiceService {
  
  private dataSubject = new BehaviorSubject<any>(null);
  data$ = this.dataSubject.asObservable();

  constructor(private http:HttpClient) { }

  public timestamp(){
    let timeInShanghai = moment().tz('Asia/Shanghai').valueOf();
    return timeInShanghai.toString();
  }

  public convertirDate(date:string){
    //date= '2023-07-19-09'
    //No es necesario ajustar la hora con shanghai, solo pon tu hora local
    let fechaInShanghai = moment(date, "YYYY-MM-DD-HH").valueOf();
    if(Number.isNaN(fechaInShanghai)){
      return date
      
    }
    return fechaInShanghai.toString();
  }

  async getPasscodesofLock(token: string, lockID: number){
    let fecha = this.timestamp()
    let url = 'https://euapi.ttlock.com/v3/lock/listKeyboardPwd'
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
      this.dataSubject.next(response);
    } catch (error) {
      console.error("Error while fetching access token:", error);
      this.dataSubject.next(null);
    }
  }

  async generatePasscode(token: string, lockID:number, type: string, name:string = "", startDate:string = this.timestamp(), endDate:string = ""){
    let fecha = this.timestamp()
    let url = 'https://euapi.ttlock.com/v3/keyboardPwd/get'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'});
    let options = { headers: header};
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockID.toString());
    body.set('keyboardPwdType', type);
    body.set('keyboardPwdName', name);
    body.set('startDate', this.convertirDate(startDate));
    body.set('endDate', this.convertirDate(endDate));
    body.set('date', fecha);
    try {
      const response = await lastValueFrom(this.http.post(url, body.toString(), options));
      console.log(response);
      this.dataSubject.next(response);
    } catch (error) {
      console.error("Error while generating a random passcode:", error);
      this.dataSubject.next(null);
    }
  }

  async generateCustomPasscode(token: string, lockID:number, keyboardPwd:string, keyboardPwdName:string = "", keyboardPwdType: string, startDate:string= this.timestamp(), endDate:string){
    let fecha = this.timestamp()
    let url = 'https://euapi.ttlock.com/v3/keyboardPwd/add'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'});
    let options = { headers: header};
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockID.toString());
    body.set('keyboardPwd', keyboardPwd);;
    body.set('keyboardPwdName', keyboardPwdName);
    if(keyboardPwdType=="2"){//PERMANENT
      body.set('keyboardPwdType', keyboardPwdType)
      body.set('addType', "2");
      body.set('date', fecha);
      try {
        const response = await lastValueFrom(this.http.post(url, body.toString(), options));
        console.log(response);
        this.dataSubject.next(response);
      } catch (error) {
        console.error("Error while generating a custom passcode:", error);
        this.dataSubject.next(null);
      }
    }
    else if (keyboardPwdType=="3"){//PERIOD
      body.set('keyboardPwdType', keyboardPwdType)
      body.set('startDate', this.convertirDate(startDate));
      body.set('endDate', this.convertirDate(endDate)); 
      body.set('addType', "2");
      body.set('date', fecha);
      try {
        const response = await lastValueFrom(this.http.post(url, body.toString(), options));
        console.log(response);
        this.dataSubject.next(response);
      } catch (error) {
        console.error("Error while generating a custom passcode:", error);
        this.dataSubject.next(null);
      }
    }
  }

  async deletePasscode(token: string, lockID:number, keyboardPwdId:number){
    let fecha = this.timestamp()
    let url = 'https://euapi.ttlock.com/v3/keyboardPwd/delete'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'});
    let options = { headers: header};
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockID.toString());
    body.set('keyboardPwdId', keyboardPwdId.toString());
    body.set('deleteType', '2');
    body.set('date', fecha);
    try {
      const response = await lastValueFrom(this.http.post(url, body.toString(), options));
      console.log(response);
      this.dataSubject.next(response);
    } catch (error) {
      console.error("Error while deleting a passcode:", error);
      this.dataSubject.next(null); // Emit null to dataSubject on error
    }
  }

  async changePasscode(passcode: Passcode, token: string, lockID:number, keyboardPwdId:number, newName:string = passcode.keyboardPwdName, newPwd:string = passcode.keyboardPwd, newStartDate:string = passcode.startDate, newEndDate:string = passcode.endDate){
    let fecha = this.timestamp()
    let url = 'https://euapi.ttlock.com/v3/keyboardPwd/change'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'});
    let options = { headers: header};
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockID.toString());
    body.set('keyboardPwdId', keyboardPwdId.toString());
    body.set('keyboardPwdName', newName);
    body.set('newKeyboardPwd', newPwd);
    body.set('startDate', this.convertirDate(newStartDate));
    body.set('endDate', this.convertirDate(newEndDate));
    body.set('changeType', '2');
    body.set('date', fecha);
    try {
      const response = await lastValueFrom(this.http.post(url, body.toString(), options));
      console.log("LOCKS: ",response);
      this.dataSubject.next(response);
    } catch (error) {
      console.error("Error while editing a passcode:", error);
      this.dataSubject.next(null); // Emit null to dataSubject on error
    }
  }

}
