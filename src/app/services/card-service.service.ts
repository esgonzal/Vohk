import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import moment from 'moment';
import { BehaviorSubject, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardServiceService {

  private dataSubject = new BehaviorSubject<any>(null);
  data$ = this.dataSubject.asObservable();

  constructor(private http:HttpClient) { }

  public timestamp(){
    let timeInShanghai = moment().tz('Asia/Shanghai').valueOf();
    return timeInShanghai.toString();
  }

  async getCardsofLock(token:string, lockID:number){
    let fecha = this.timestamp()
    let url = 'https://euapi.ttlock.com/v3/identityCard/list'
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
      console.error("Error while blah blah:", error);
      this.dataSubject.next(null); // Emit null to dataSubject on error
    }
  }

  async changeName(token:string,lockID:number, cardID:number, newName:string){
    let fecha = this.timestamp()
    let url = 'https://euapi.ttlock.com/v3/identityCard/rename'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'});
    let options = { headers: header};
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockID.toString());
    body.set('cardId', cardID.toString());
    body.set('cardName', newName);
    body.set('date', fecha);
    try {
      const response = await lastValueFrom(this.http.post(url, body.toString(), options));
      this.dataSubject.next(response); // Emit the response to dataSubject
    } catch (error) {
      console.error("Error while blah blah2:", error);
      this.dataSubject.next(null); // Emit null to dataSubject on error
    }
  }
}
