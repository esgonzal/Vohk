import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { PasscodeResponse } from '../Interfaces/Elements';
import { LockServiceService } from './lock-service.service';

@Injectable({
  providedIn: 'root'
})
export class PasscodeServiceService {

  private dataSubject = new BehaviorSubject<any>(null);
  data$ = this.dataSubject.asObservable();
  lockAlias: string;
  token: string;
  lockID: number;
  endDateUser: string;
  passcodesimple = false;

  constructor(private lockService: LockServiceService, private http: HttpClient) { }

  getPasscodesofLock(token: string, lockID: number, pageNo: number, pageSize: number): Observable<PasscodeResponse> {
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/lock/listKeyboardPwd'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: header };
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockID.toString());
    body.set('pageNo', pageNo.toString());
    body.set('pageSize', pageSize.toString());
    body.set('date', fecha);
    return this.http.post<PasscodeResponse>(url, body.toString(), options);
  }
  async generatePasscode(token: string, lockID: number, type: string, startDate: string, name?: string, endDate?: string) {
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/keyboardPwd/get'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: header };
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockID.toString());
    body.set('keyboardPwdType', type);
    body.set('date', fecha);
    body.set('startDate', startDate);
    if (name !== undefined) { body.set('keyboardPwdName', name) }
    if (endDate !== undefined) { body.set('endDate', endDate) }
    try {
      const response = await lastValueFrom(this.http.post(url, body.toString(), options));
      this.dataSubject.next(response);
      console.log(response)
    } catch (error) {
      console.error("Error while generating a random passcode:", error);
      this.dataSubject.next(null);
    }
  }
  async generateCustomPasscode(token: string, lockID: number, keyboardPwd: string, keyboardPwdType: string, keyboardPwdName?: string, startDate?: string, endDate?: string) {
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/keyboardPwd/add'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: header };
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockID.toString());
    body.set('keyboardPwd', keyboardPwd);;
    body.set('addType', "2");
    body.set('keyboardPwdType', keyboardPwdType)
    body.set('date', fecha);
    if (keyboardPwdName !== undefined) { body.set('keyboardPwdName', keyboardPwdName); }
    if (startDate !== undefined) { body.set('startDate', startDate) }
    if (endDate !== undefined) { body.set('endDate', endDate) }
    try {
      const response = await lastValueFrom(this.http.post(url, body.toString(), options));
      this.dataSubject.next(response);
      console.log(response)
    } catch (error) {
      console.error("Error while generating a custom passcode:", error);
      this.dataSubject.next(null);
    }
  }
  async deletePasscode(token: string, lockID: number, keyboardPwdId: number) {
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/keyboardPwd/delete'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: header };
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockID.toString());
    body.set('keyboardPwdId', keyboardPwdId.toString());
    body.set('deleteType', '2');
    body.set('date', fecha);
    try {
      const response = await lastValueFrom(this.http.post(url, body.toString(), options));
      this.dataSubject.next(response);
      console.log(response)
    } catch (error) {
      console.error("Error while deleting a passcode:", error);
      this.dataSubject.next(null); // Emit null to dataSubject on error
    }
  }
  async changePasscode(token: string, lockID: number, keyboardPwdId: number, newName?: string, newPwd?: string, newStartDate?: string, newEndDate?: string) {
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/keyboardPwd/change'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: header };
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockID.toString());
    body.set('keyboardPwdId', keyboardPwdId.toString());
    body.set('changeType', '2');
    body.set('date', fecha);
    if (newName !== undefined) { body.set('keyboardPwdName', newName); }
    if (newPwd !== undefined) { body.set('newKeyboardPwd', newPwd); }
    if (newStartDate !== undefined) { body.set('startDate', newStartDate); }
    if (newEndDate !== undefined) { body.set('endDate', newEndDate); }
    try {
      const response = await lastValueFrom(this.http.post(url, body.toString(), options));
      this.dataSubject.next(response);
      console.log(response)
    } catch (error) {
      console.error("Error while editing a passcode:", error);
      this.dataSubject.next(null); // Emit null to dataSubject on error
    }
  }
}
