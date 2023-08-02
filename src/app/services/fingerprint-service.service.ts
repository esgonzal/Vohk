import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import moment from 'moment';
import { BehaviorSubject, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FingerprintServiceService {

  private dataSubject = new BehaviorSubject<any>(null);
  data$ = this.dataSubject.asObservable();

  constructor(private http:HttpClient) { }

  public timestamp(){
    let timeInShanghai = moment().tz('Asia/Shanghai').valueOf();
    return timeInShanghai.toString();
  }

  public convertirDate(date:string){
    //date= '2023-07-19-09'
    //No es necesario ajustar la hora con shanghai, solo pon tu hora local
    let fechaInShanghai = moment(date, "YYYY-MM-DD-HH:mm").valueOf();
    if(Number.isNaN(fechaInShanghai)){
      return date
      
    }
    return fechaInShanghai.toString();
  }

  async getFingerprintsofLock(token:string, lockID:number){
    let fecha = this.timestamp()
      let url = 'https://euapi.ttlock.com/v3/fingerprint/list'
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

  async deleteFingerprint(token:string, lockID:number, fingerprintID:number){
    let fecha = this.timestamp()
    let url = 'https://euapi.ttlock.com/v3/fingerprint/delete'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'});
    let options = { headers: header};
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockID.toString());
    body.set('fingerprintId', fingerprintID.toString());
    body.set('deleteType', "2");
    body.set('date', fecha);
    try {
      const response = await lastValueFrom(this.http.post(url, body.toString(), options));
      this.dataSubject.next(response); // Emit the response to dataSubject
    } catch (error) {
      console.error("Error while deleting the fingerprint:", error);
      this.dataSubject.next(null); // Emit null to dataSubject on error
    }
  }

  async changeName(token:string, lockID:number, fingerprintID:number, newName:string){
    let fecha = this.timestamp()
    let url = 'https://euapi.ttlock.com/v3/fingerprint/rename'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'});
    let options = { headers: header};
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockID.toString());
    body.set('fingerprintId', fingerprintID.toString());
    body.set('fingerprintName', newName);
    body.set('date', fecha);
    try {
      const response = await lastValueFrom(this.http.post(url, body.toString(), options));
      this.dataSubject.next(response); // Emit the response to dataSubject
    } catch (error) {
      console.error("Error while renaming the fingerprint:", error);
      this.dataSubject.next(null); // Emit null to dataSubject on error
    }
  }

  async changePeriod(token:string, lockID:number, fingerprintID:number, newStartDate:string, newEndDate:string){
    let fecha = this.timestamp()
    let url = 'https://euapi.ttlock.com/v3/fingerprint/changePeriod'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'});
    let options = { headers: header};
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockID.toString());
    body.set('fingerprintId', fingerprintID.toString());
    body.set('startDate', this.convertirDate(newStartDate));
    body.set('endDate', this.convertirDate(newEndDate));
    body.set('changeType', '2');
    body.set('date', fecha);
    try {
      const response = await lastValueFrom(this.http.post(url, body.toString(), options));
      console.log(response);
      this.dataSubject.next(response);
    } catch (error) {
      console.error("Error while changing the validity period of the fingerprint:", error);
      this.dataSubject.next(null); // Emit null to dataSubject on error
    }
  }
}
