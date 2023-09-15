import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LockServiceService } from './lock-service.service';
import { GatewayAccountResponse, GatewayLockResponse, GetLockTimeResponse, operationResponse } from '../Interfaces/API_responses';

@Injectable({
  providedIn: 'root'
})
export class GatewayService {

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
  unlock(token: string, lockID: number): Observable<operationResponse> {
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
    return this.http.post<operationResponse>(url, body.toString(), options);
    
  }
  lock(token: string, lockID: number): Observable<operationResponse> {
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
    return this.http.post<operationResponse>(url, body.toString(), options);
  }
  getLockTime(token: string, lockId: number): Observable<GetLockTimeResponse> {
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
    return this.http.post<GetLockTimeResponse>(url, body.toString(), options);
  }
  adjustLockTime(token: string, lockId: number): Observable<GetLockTimeResponse> {
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
    return this.http.post<GetLockTimeResponse>(url, body.toString(), options)
  }
}
