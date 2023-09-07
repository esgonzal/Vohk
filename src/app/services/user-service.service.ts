import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Md5 } from 'ts-md5';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { LockServiceService } from './lock-service.service';
import { GetAccessTokenResponse, ResetPasswordResponse, UserRegisterResponse } from '../Interfaces/User';
import { PhoneNumberUtil } from 'google-libphonenumber';
import emailjs from 'emailjs-com';


@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  nombre_usuario: string;
  clave_usuario: string;
  loggedIn = false;
  private phoneNumberUtil: PhoneNumberUtil;

  constructor(private http: HttpClient, private lockService: LockServiceService) { 
    this.phoneNumberUtil = PhoneNumberUtil.getInstance();
  }

  getMD5(clave: string) {
    return Md5.hashStr(clave);
  }
  customBase64Encode(input: string) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let output = '';
    let padding = 0;
    let position = 0;
    for (let i = 0; i < input.length; i++) {
      padding = (padding << 8) | input.charCodeAt(i);
      position += 8;

      while (position >= 6) {
        const index = (padding >> (position - 6)) & 0x3f;
        output += chars.charAt(index);
        position -= 6;
      }
    }
    if (position > 0) {
      const index = (padding << (6 - position)) & 0x3f;
      output += chars.charAt(index);
    }
    return output;
  }
  customBase64Decode(encoded: string): string {
    const base64Chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const base64Lookup: { [key: string]: number } = {};
    for (let i = 0; i < base64Chars.length; i++) {
      base64Lookup[base64Chars.charAt(i)] = i;
    }
    let decoded = '';
    let buffer = 0;
    let numBits = 0;
    for (let i = 0; i < encoded.length; i++) {
      const char = encoded.charAt(i);
      const value = base64Lookup[char];
      if (value === undefined) {
        // Invalid character in the encoded string
        throw new Error('Invalid character in encoded string');
      }
      buffer = (buffer << 6) | value;
      numBits += 6;
      if (numBits >= 8) {
        decoded += String.fromCharCode((buffer >> (numBits - 8)) & 0xff);
        buffer &= (1 << (numBits - 8)) - 1;
        numBits -= 8;
      }
    }
    return decoded;
  }
  isValidEmail(email: string): boolean {//Verifica si el nombre del destinatario es un email o no
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }
  isValidPhone(phone: string): { isValid: boolean, country?: string } {
    try {
      const phoneNumber = this.phoneNumberUtil.parse(phone);
      if (this.phoneNumberUtil.isValidNumber(phoneNumber)) {
        const country = this.phoneNumberUtil.getRegionCodeForNumber(phoneNumber);
        return { isValid: true, country };
      } else {
        return { isValid: false };
      }
    } catch (error) {
      return { isValid: false }; // Parsing error, not a valid phone number
    }
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
  sendEmail_NewUser(recipientEmail: string, password: string) {//Template para passcode recurrente
    //esteban.vohk+6@gmail.com
    emailjs.send('contact_service', 'NewUser', {
      to_email: recipientEmail,
      subject: 'Bienvenido a la plataforma VOHK',
      username: recipientEmail,
      password: password,
    }, 'bdNkCTZsViZUFZCL9')
      .then((response) => { console.log('Email sent successfully:', response); })
      .catch((error) => { console.error('Error sending email:', error); });
  }

}
