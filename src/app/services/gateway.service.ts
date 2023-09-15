import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { LockServiceService } from './lock-service.service';
import { GatewayAccount } from '../Interfaces/Gateway';
import { GatewayAccountResponse, GatewayLockResponse } from '../Interfaces/API_responses';

@Injectable({
  providedIn: 'root'
})
export class GatewayService {

  private dataSubject = new BehaviorSubject<any>(null);
  data$ = this.dataSubject.asObservable();
  private dataSubject2 = new BehaviorSubject<any>(null);
  data2$ = this.dataSubject2.asObservable();

  token: string;
  lockID: number;

  constructor(private http: HttpClient, private lockService: LockServiceService) { }

  getGatewayListOfLock(token: string, lockID: number): Observable<GatewayLockResponse> {
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/gateway/listByLock'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: header };
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockID.toString())
    body.set('date', fecha);
    return this.http.post<GatewayLockResponse>(url, body.toString(), options);
  }
  getGatewaysAccount(token: string, pageNo: number, pageSize: number): Observable<GatewayAccountResponse> {
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/gateway/list'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: header };
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('pageNo', pageNo.toString());
    body.set('pageSize', pageSize.toString());
    body.set('date', fecha);
    return this.http.post<GatewayAccountResponse>(url, body.toString(), options);
  }
  async unlock(token: string, lockID: number) {
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/lock/unlock'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: header };
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockID.toString())
    body.set('date', fecha);
    try {
      const response = await lastValueFrom(this.http.post(url, body.toString(), options));
      this.dataSubject.next(response);
      console.log(response)
    } catch (error) {
      console.error("Error while getting the list of Gateways of a Lock:", error);
      this.dataSubject.next(null); // Emit null to dataSubject on error
    }
  }
  async lock(token: string, lockID: number) {
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/lock/lock'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: header };
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockID.toString())
    body.set('date', fecha);
    try {
      const response = await lastValueFrom(this.http.post(url, body.toString(), options));
      this.dataSubject.next(response);
      console.log(response)
    } catch (error) {
      console.error("Error while getting the list of Gateways of a Lock:", error);
      this.dataSubject.next(null); // Emit null to dataSubject on error
    }
  }
  async getLockTime(token: string, lockId: number) {
    let fecha = this.lockService.timestamp();
    let url = 'https://euapi.ttlock.com/v3/lock/queryDate'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: header };
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockId.toString())
    body.set('date', fecha);
    try {
      const response = await lastValueFrom(this.http.post(url, body.toString(), options));
      this.dataSubject.next(response);
      console.log(response)
    } catch (error) {
      console.error("Error while getting the time of the lock:", error);
      this.dataSubject.next(null); // Emit null to dataSubject on error
    }
  }
  async adjustLockTime(token: string, lockId: number) {
    let fecha = this.lockService.timestamp();
    let url = 'https://euapi.ttlock.com/v3/lock/updateDate'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: header };
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockId.toString())
    body.set('date', fecha);
    try {
      const response = await lastValueFrom(this.http.post(url, body.toString(), options));
      this.dataSubject.next(response);
      console.log(response)
    } catch (error) {
      console.error("Error while getting the time of the lock:", error);
      this.dataSubject.next(null); // Emit null to dataSubject on error
    }
  }
}
