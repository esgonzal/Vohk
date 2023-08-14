import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 

import moment from 'moment-timezone';
import {Md5} from 'ts-md5';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  nombre_usuario:string;
  clave_usuario:string;
  fullNombre_usuario:string;
  private dataSubject = new BehaviorSubject<any>(null);
  data$ = this.dataSubject.asObservable();

  constructor(private http: HttpClient) { }

  public getMD5(clave:string){return Md5.hashStr(clave);}

  public timestamp(){
    let timeInShanghai = moment().tz('Asia/Shanghai').valueOf();
    return timeInShanghai;
  }
  
  UserRegister(nombre:string, clave:string){
    let clave_encriptada = this.getMD5(clave);
    let date = this.timestamp()
    let url = 'https://euapi.ttlock.com/v3/user/register';
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'});
    let options = { headers: header};
    let body= new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('clientSecret', '33b556bdb803763f2e647fc7a357dedf');
    body.set('username', nombre);
    body.set('password', clave_encriptada);
    body.set('date', date.toString());
    this.http.post(url ,body.toString(), options).subscribe((response: any) => {
      console.log(response);
    });
  }

  async getAccessToken(nombre: string, clave: string){
    let clave_encriptada = this.getMD5(clave);
    let url = 'https://euapi.ttlock.com/oauth2/token';
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'});
    let options = { headers: header};
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('clientSecret', '33b556bdb803763f2e647fc7a357dedf');
    body.set('username', nombre);
    body.set('password', clave_encriptada);
    try {
      const response = await lastValueFrom(this.http.post(url, body.toString(), options));
      this.dataSubject.next(response); // Emit the response to dataSubject
      console.log(response);
    } catch (error) {
      console.error("Error while fetching access token:", error);
      this.dataSubject.next(null); // Emit null to dataSubject on error
    }
  }

  DeleteUser(nombre: string){
    let url =  'https://euapi.ttlock.com/v3/user/delete';
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'});
    let options = { headers: header};
    let date = this.timestamp()
    let prefix = 'bhaaa_';
    let username = prefix.concat(nombre)
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('clientSecret', '33b556bdb803763f2e647fc7a357dedf');
    body.set('username', username);
    body.set('date', date.toString());
    this.http.post(url, body.toString(), options).subscribe((response: any) => {
      console.log(response)
    });
  }

  ResetPassword(nombre: string, clave: string){
    let clave_encriptada = this.getMD5(clave);
    let date = this.timestamp()
    const url = 'https://euapi.ttlock.com/v3/user/resetPassword';
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'});
    let options = { headers: header};
    let prefix = 'bhaaa_';
    let username = prefix.concat(nombre)
    let body= new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('clientSecret', '33b556bdb803763f2e647fc7a357dedf');
    body.set('username', username);
    body.set('password', clave_encriptada);
    body.set('date', date.toString());
    let res = this.http.post(url ,body.toString(), options)
    res.subscribe((response: any) => {
      console.log(response);
    });
  }


}
