import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import moment from 'moment';
import 'moment-timezone';
import { operationResponse } from '../Interfaces/Elements';

@Injectable({
  providedIn: 'root'
})
export class LockServiceService {

  private dataSubject = new BehaviorSubject<any>(null);
  data$ = this.dataSubject.asObservable();
  token: string;
  lockID: number;

  constructor(private http: HttpClient) { }

  public timestamp() {
    let timeInShanghai = moment().tz('Asia/Shanghai').valueOf()
    return timeInShanghai.toString();
  }
  public transformarHora(Tiempo: string) {//Esta funcion está encargada de convertir el resultado del timepicker, un string de formato ("HH:mm"), en un number que representa el tiempo en milisegundos
    let tiempoHora = Tiempo.split(":")[0]
    let tiempoMinuto = Tiempo.split(":")[1]
    return ((Number(tiempoHora) * 60 + Number(tiempoMinuto)) * 60000).toString()
  }
  public checkFeature(featureValue: string, bit: number) {
    const binaryValue = BigInt(`0x${featureValue}`).toString(2)
    const reversedBinary = binaryValue.split('').reverse().join('');
    return reversedBinary[bit] === '1';
  }
  async getLockListAccount(token: string) {
    let fecha = this.timestamp()
    let url = 'https://euapi.ttlock.com/v3/lock/list'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: header };
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
  async getLockDetails(token: string, lockId: number) {
    let fecha = this.timestamp()
    let url = 'https://euapi.ttlock.com/v3/lock/detail'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: header };
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockId.toString());
    body.set('date', fecha.toString());
    try {
      const response = await lastValueFrom(this.http.post(url, body.toString(), options));
      this.dataSubject.next(response);
    } catch (error) {
      console.error("Error while fetching lock details:", error);
      this.dataSubject.next(null); // Emit null to dataSubject on error
    }
  }
  async changeLockName(token: string, lockId: number, newLockAlias: string) {
    let fecha = this.timestamp()
    let url = 'https://euapi.ttlock.com/v3/lock/rename'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: header };
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockId.toString());
    body.set('lockAlias', newLockAlias);
    body.set('date', fecha.toString());
    try {
      const response = await lastValueFrom(this.http.post(url, body.toString(), options));
      console.log(response)
    } catch (error) {
      console.error("Error while changing name of a lock:", error);
      this.dataSubject.next(null); // Emit null to dataSubject on error
      throw new Error("Lock alias update failed.");
    }
  }
  setAutoLock(token: string, lockId: number, seconds: number): Observable<operationResponse> {
    let fecha = this.timestamp()
    let url = 'https://euapi.ttlock.com/v3/lock/setAutoLockTime'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: header };
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockId.toString());
    body.set('seconds', seconds.toString());
    body.set('type', '2')
    body.set('date', fecha.toString());
    return this.http.post<operationResponse>(url, body.toString(), options);
  }
  transferLock(token: string, receiverUsername: string, lockIdList: string): Observable<operationResponse> {
    let fecha = this.timestamp()
    let url = 'https://euapi.ttlock.com/v3/lock/transfer'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: header };
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('receiverUsername', receiverUsername);
    body.set('lockIdList', lockIdList);
    body.set('date', fecha.toString());
    return this.http.post<operationResponse>(url, body.toString(), options);
  }
}
