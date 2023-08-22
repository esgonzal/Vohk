import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import moment from 'moment';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { LockServiceService } from './lock-service.service';
import { CardResponse } from '../Interfaces/Elements';

@Injectable({
  providedIn: 'root'
})
export class CardServiceService {

  private dataSubject = new BehaviorSubject<any>(null);
  data$ = this.dataSubject.asObservable();
  token: string;
  lockID: number;
  cardID: number;

  constructor(private lockService:LockServiceService, private http:HttpClient) { }

  getCardsofLock(token:string, lockID:number, pageNo: number, pageSize: number): Observable<CardResponse>{
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/identityCard/list'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'});
    let options = { headers: header};
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockID.toString());
    body.set('pageNo', pageNo.toString());
    body.set('pageSize', pageSize.toString());
    body.set('date', fecha);
    return this.http.post<CardResponse>(url, body.toString(), options);
  }

  async changeName(token:string, lockID:number, cardID:number, newName:string){
    let fecha = this.lockService.timestamp()
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
      this.dataSubject.next(response);
      console.log(response)
    } catch (error) {
      console.error("Error while changing the card name:", error);
      this.dataSubject.next(null); // Emit null to dataSubject on error
    }
  }

  async deleteCard(token:string, lockID:number, cardID:number){
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/identityCard/delete'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'});
    let options = { headers: header};
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockID.toString());
    body.set('cardId', cardID.toString());
    body.set('deleteType', "2");
    body.set('date', fecha);
    try {
      const response = await lastValueFrom(this.http.post(url, body.toString(), options));
      this.dataSubject.next(response);
      console.log(response);
    } catch (error) {
      console.error("Error while deleting the card:", error);
      this.dataSubject.next(null); // Emit null to dataSubject on error
    }
  }

  async changePeriod(token:string, lockID:number, cardID:number, newStartDate:string, newEndDate:string){
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/identityCard/changePeriod'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'});
    let options = { headers: header};
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockID.toString());
    body.set('cardId', cardID.toString());
    body.set('startDate', newStartDate);
    body.set('endDate', newEndDate);
    body.set('changeType', '2');
    body.set('date', fecha);
    try {
      const response = await lastValueFrom(this.http.post(url, body.toString(), options));
      this.dataSubject.next(response);
      console.log(response)
    } catch (error) {
      console.error("Error while changing the validity period of a card:", error);
      this.dataSubject.next(null); // Emit null to dataSubject on error
    }
  }
}
