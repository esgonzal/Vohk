import { Injectable } from '@angular/core';
import { PassageMode } from '../Interfaces/PassageMode';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LockServiceService } from './lock-service.service';
import { Observable } from 'rxjs'
import { operationResponse } from '../Interfaces/API_responses';

@Injectable({
  providedIn: 'root'
})
export class PassageModeService {

  token: string;
  lockID: number;
  passageModeConfig: PassageMode;

  constructor(private http: HttpClient, private lockService: LockServiceService) { }

  getPassageModeConfig(token: string, lockId: number): Observable<PassageMode>{
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/lock/getPassageModeConfig'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: header };
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockId.toString());
    body.set('date', fecha);
    return this.http.post<PassageMode>(url, body.toString(), options);
  }
  setPassageMode(token: string, lockId: number, Config: PassageMode): Observable<operationResponse> {
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/lock/configPassageMode'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: header };
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockId.toString());
    body.set('passageMode', Config.passageMode.toString());
    body.set('startDate', Config.startDate);
    body.set('endDate', Config.endDate);
    body.set('isAllDay', Config.isAllDay.toString());
    body.set('weekDays', JSON.stringify(Config.weekDays));
    body.set('type', '2');
    body.set('date', fecha);
    return this.http.post<operationResponse>(url, body.toString(), options);
  }
}
