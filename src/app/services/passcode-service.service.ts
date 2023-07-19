import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import moment from 'moment';
import { BehaviorSubject, lastValueFrom } from 'rxjs';

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
      this.dataSubject.next(response); // Emit the response to dataSubject
    } catch (error) {
      console.error("Error while fetching access token:", error);
      this.dataSubject.next(null); // Emit null to dataSubject on error
    }
  }

  async generatePasscode(token: string, lockID:number, type: number, name:string = "", startDate:string = this.timestamp(), endDate:string = ""){
    let fecha = this.timestamp()
    let url = 'https://euapi.ttlock.com/v3/keyboardPwd/get'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'});
    let options = { headers: header};
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockID.toString());
    body.set('keyboardPwdType', type.toString());
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
      this.dataSubject.next(null); // Emit null to dataSubject on error
    }
  }
}
