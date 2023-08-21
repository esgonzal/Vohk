import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { LockServiceService } from './lock-service.service';

@Injectable({
  providedIn: 'root'
})
export class RecordServiceService {

  private dataSubject = new BehaviorSubject<any>(null);
  data$ = this.dataSubject.asObservable();

  constructor(private http:HttpClient, private lockService:LockServiceService) { }

  async getRecords(token: string, lockID: number, pageNo: number, pageSize: number){
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/lockRecord/list'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'});
    let options = { headers: header};
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockID.toString());
    body.set('pageNo', pageNo.toString());
    body.set('pageSize', pageSize.toString());//LOS ULTIMOS 100 RECORDS DE LA CERRADURA
    body.set('date', fecha);
    try {
      const response = await lastValueFrom(this.http.post(url, body.toString(), options));
      this.dataSubject.next(response);
    } catch (error) {
      console.error("Error while fetching access token:", error);
      this.dataSubject.next(null);
    }
  }
}
