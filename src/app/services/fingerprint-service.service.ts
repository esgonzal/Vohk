import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { LockServiceService } from './lock-service.service';
import { FingerprintResponse, operationResponse } from '../Interfaces/Elements';

@Injectable({
  providedIn: 'root'
})
export class FingerprintServiceService {

  private dataSubject = new BehaviorSubject<any>(null);
  data$ = this.dataSubject.asObservable();

  constructor(private http: HttpClient, private lockService: LockServiceService) { }

  getFingerprintsofLock(token: string, lockID: number, pageNo: number, pageSize: number): Observable<FingerprintResponse> {
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/fingerprint/list'
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
    return this.http.post<FingerprintResponse>(url, body.toString(), options);
  }
  deleteFingerprint(token: string, lockID: number, fingerprintID: number): Observable<operationResponse> {
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/fingerprint/delete'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: header };
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockID.toString());
    body.set('fingerprintId', fingerprintID.toString());
    body.set('deleteType', "2");
    body.set('date', fecha);
    return this.http.post<operationResponse>(url, body.toString(), options);
  }
  changeName(token: string, lockID: number, fingerprintID: number, newName: string): Observable<operationResponse> {
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/fingerprint/rename'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: header };
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockID.toString());
    body.set('fingerprintId', fingerprintID.toString());
    body.set('fingerprintName', newName);
    body.set('date', fecha);
    return this.http.post<operationResponse>(url, body.toString(), options);
  }
  changePeriod(token: string, lockID: number, fingerprintID: number, newStartDate: string, newEndDate: string): Observable<operationResponse> {
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/fingerprint/changePeriod'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: header };
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockID.toString());
    body.set('fingerprintId', fingerprintID.toString());
    body.set('startDate', newStartDate);
    body.set('endDate', newEndDate);
    body.set('changeType', '2');
    body.set('date', fecha);
    return this.http.post<operationResponse>(url, body.toString(), options);
  }
}
