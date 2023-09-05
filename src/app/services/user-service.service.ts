import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Md5 } from 'ts-md5';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { LockServiceService } from './lock-service.service';
import { GetAccessTokenResponse, ResetPasswordResponse, UserRegisterResponse } from '../Interfaces/User';

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
  isValidEmail(email: string): boolean {//Verifica si el nombre del destinatario es un email o no
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }
  async isEmailNew(email: string) {//Verifica si el email de la cuenta tiene la contraseña de defecto.
    const response = await lastValueFrom(this.getAccessToken(email, 'il.com'));
    const typedResponse = response as GetAccessTokenResponse;
    if (typedResponse.access_token) {//El usuario tiene la clave de defecto
      return true;
    } else {
      return false;
    }
  }
  UserRegister(nombre: string, clave: string): Observable<UserRegisterResponse> {
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
    return this.http.post<UserRegisterResponse>(url, body.toString(), options)
  }
  getAccessToken(nombre: string, clave: string): Observable<GetAccessTokenResponse> {
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
    return this.http.post<GetAccessTokenResponse>(url, body.toString(), options);
  }
  ResetPassword(nombre: string, clave: string): Observable<ResetPasswordResponse> {
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
    return this.http.post<ResetPasswordResponse>(url, body.toString(), options);
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
  
}
