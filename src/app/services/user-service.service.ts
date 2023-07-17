import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 

import moment from 'moment-timezone';
import {Md5} from 'ts-md5';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  nombre_usuario:string;
  clave_usuario:string;
  data:any[]
  constructor(private http: HttpClient) { }

  getnombre_usuario(): string{
    return this.nombre_usuario;
  }
  setnombre_usuario(nombre:string): void{
    this.nombre_usuario = nombre;
  }

  getclave_usuario(): string{
    return this.clave_usuario;
  }
  setclave_usuario(clave:string): void{
    this.clave_usuario = clave;
  }

  getdata_usuario() {
    console.log("en el service get ", this.data)
    return this.data;
  }

  setdata_usuario(data: any[]){
    this.data = data;
    console.log("en el service set ", this.data)
  }

  public getMD5(clave:string){
    return Md5.hashStr(clave);
  }

  public timestamp(){
    let timeInShanghai = moment().tz('Asia/Shanghai').format()
    return timeInShanghai;
  }
  
  UserRegister(nombre:string, clave:string){
    let clave_encriptada = this.getMD5(clave);
    let date = this.timestamp()
    const url = 'https://euapi.ttlock.com/v3/user/register';
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'});
    let options = { headers: header};
    let body= new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('clientSecret', '33b556bdb803763f2e647fc7a357dedf');
    body.set('username', nombre);
    body.set('password', clave_encriptada);
    body.set('date', date);
    this.http.post(url ,body.toString(), options).subscribe((response: any) => {
      console.log(response);
    });
  }

  getAccessToken(nombre: string, clave: string){
    let clave_encriptada = this.getMD5(clave);
    let url = 'https://euapi.ttlock.com/oauth2/token';
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'});
    let options = { headers: header};
    let prefix = 'bhaaa_';
    let username = prefix.concat(nombre)
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('clientSecret', '33b556bdb803763f2e647fc7a357dedf');
    body.set('username', username);
    body.set('password', clave_encriptada);
    this.http.post(url, body.toString(), options)
    let res = this.http.post(url, body.toString(), options).subscribe((response: any) => {
      this.data = response
      this.setdata_usuario(this.data)
    });
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
    body.set('date', date);
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

    console.log("nombre en el service: ", username);
    console.log("clave normal en el service: ", clave);
    console.log("clave encriptada en el service: ", clave_encriptada);

    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('clientSecret', '33b556bdb803763f2e647fc7a357dedf');
    body.set('username', username);
    body.set('password', clave_encriptada);
    body.set('date', date);
    let res = this.http.post(url ,body.toString(), options)
    res.subscribe((response: any) => {
      console.log(response);
    });
  }


}
