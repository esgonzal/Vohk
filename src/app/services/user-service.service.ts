import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Md5 } from 'ts-md5';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { LockServiceService } from './lock-service.service';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  nombre_usuario: string;
  clave_usuario: string;
  loggedIn = false;
  private dataSubject = new BehaviorSubject<any>(null);
  data$ = this.dataSubject.asObservable();

  constructor(private http: HttpClient, private lockService: LockServiceService) { }

  public getMD5(clave: string) { 
    return Md5.hashStr(clave); 
  }
  UserRegister(nombre: string, clave: string) {
    let date = this.lockService.timestamp();
    let clave_encriptada = this.getMD5(clave);
    let url = 'https://euapi.ttlock.com/v3/user/register';
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: header };
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('clientSecret', '33b556bdb803763f2e647fc7a357dedf');
    body.set('username', nombre);
    body.set('password', clave_encriptada);
    body.set('date', date.toString());
    this.http.post(url, body.toString(), options).subscribe((response: any) => {
      console.log(response);
    });
  }
  async getAccessToken(nombre: string, clave: string) {
    let clave_encriptada = this.getMD5(clave);
    let url = 'https://euapi.ttlock.com/oauth2/token';
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: header };
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('clientSecret', '33b556bdb803763f2e647fc7a357dedf');
    body.set('username', nombre);
    body.set('password', clave_encriptada);
    try {
      const response = await lastValueFrom(this.http.post(url, body.toString(), options));
      this.dataSubject.next(response); // Emit the response to dataSubject
    } catch (error) {
      console.error("Error while fetching access token:", error);
      this.dataSubject.next(null); // Emit null to dataSubject on error
    }
  }
  DeleteUser(nombre: string) {
    let date = this.lockService.timestamp();
    let url = 'https://euapi.ttlock.com/v3/user/delete';
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: header };
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
  ResetPassword(nombre: string, clave: string) {
    let date = this.lockService.timestamp()
    let clave_encriptada = this.getMD5(clave);
    const url = 'https://euapi.ttlock.com/v3/user/resetPassword';
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: header };
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('clientSecret', '33b556bdb803763f2e647fc7a357dedf');
    body.set('username', nombre);
    body.set('password', clave_encriptada);
    body.set('date', date.toString());
    let res = this.http.post(url, body.toString(), options)
    res.subscribe((response: any) => {
      console.log(response);
    });
  }
}
