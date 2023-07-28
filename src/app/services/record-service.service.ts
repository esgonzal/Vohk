import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import moment from 'moment';
import { BehaviorSubject, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecordServiceService {

  private dataSubject = new BehaviorSubject<any>(null);
  data$ = this.dataSubject.asObservable();

  constructor(private http:HttpClient,
              ) { }

  public timestamp(){
    let timeInShanghai = moment().tz('Asia/Shanghai').valueOf();
    return timeInShanghai.toString();
  }

  async getRecords(token: string, lockID: number){
    let fecha = this.timestamp()
    let url = 'https://euapi.ttlock.com/v3/lockRecord/list'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'});
    let options = { headers: header};
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockID.toString());
    body.set('pageNo', '1');
    body.set('pageSize', '100');//LOS ULTIMOS 100 RECORDS DE LA CERRADURA
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
