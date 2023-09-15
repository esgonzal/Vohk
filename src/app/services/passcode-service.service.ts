import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PasscodeResponse, createPasscodeResponse, operationResponse } from '../Interfaces/API_responses';
import { LockServiceService } from './lock-service.service';
import emailjs from 'emailjs-com';

@Injectable({
  providedIn: 'root'
})
export class PasscodeServiceService {

  username = localStorage.getItem('user') ?? ''
  lockAlias = localStorage.getItem('Alias') ?? ''
  token: string;
  lockID: number;
  endDateUser: string;
  passcodesimple = false;

  constructor(private lockService: LockServiceService, private http: HttpClient) { }

  getPasscodesofLock(token: string, lockID: number, pageNo: number, pageSize: number): Observable<PasscodeResponse> {
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/lock/listKeyboardPwd'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: header };
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockID.toString());
    body.set('pageNo', pageNo.toString());
    body.set('pageSize', pageSize.toString());
    body.set('date', fecha);
    return this.http.post<PasscodeResponse>(url, body.toString(), options);
  }
  generatePasscode(token: string, lockID: number, type: string, startDate: string, name?: string, endDate?: string): Observable<createPasscodeResponse> {
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/keyboardPwd/get'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: header };
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockID.toString());
    body.set('keyboardPwdType', type);
    body.set('date', fecha);
    body.set('startDate', startDate);
    if (name !== undefined) { body.set('keyboardPwdName', name) }
    if (endDate !== undefined) { body.set('endDate', endDate) }
    return this.http.post<createPasscodeResponse>(url, body.toString(), options);
  }
  generateCustomPasscode(token: string, lockID: number, keyboardPwd: string, keyboardPwdType: string, keyboardPwdName?: string, startDate?: string, endDate?: string): Observable<createPasscodeResponse> {
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/keyboardPwd/add'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: header };
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockID.toString());
    body.set('keyboardPwd', keyboardPwd);;
    body.set('addType', "2");
    body.set('keyboardPwdType', keyboardPwdType)
    body.set('date', fecha);
    if (keyboardPwdName !== undefined) { body.set('keyboardPwdName', keyboardPwdName); }
    if (startDate !== undefined) { body.set('startDate', startDate) }
    if (endDate !== undefined) { body.set('endDate', endDate) }
    return this.http.post<createPasscodeResponse>(url, body.toString(), options);
  }
  deletePasscode(token: string, lockID: number, keyboardPwdId: number): Observable<operationResponse> {
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/keyboardPwd/delete'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: header };
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockID.toString());
    body.set('keyboardPwdId', keyboardPwdId.toString());
    body.set('deleteType', '2');
    body.set('date', fecha);
    return this.http.post<operationResponse>(url, body.toString(), options);
  }
  changePasscode(token: string, lockID: number, keyboardPwdId: number, newName?: string, newPwd?: string, newStartDate?: string, newEndDate?: string): Observable<operationResponse> {
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/keyboardPwd/change'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: header };
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockID.toString());
    body.set('keyboardPwdId', keyboardPwdId.toString());
    body.set('changeType', '2');
    body.set('date', fecha);
    if (newName !== undefined) { body.set('keyboardPwdName', newName); }
    if (newPwd !== undefined) { body.set('newKeyboardPwd', newPwd); }
    if (newStartDate !== undefined) { body.set('startDate', newStartDate); }
    if (newEndDate !== undefined) { body.set('endDate', newEndDate); }
    return this.http.post<operationResponse>(url, body.toString(), options);
  }
  sendEmail_PermanentPasscode(recipientEmail: string, code: string) {//Template para passcode permanente
    //esteban.vohk+4@gmail.com
    emailjs.send('contact_service', 'PasscodePermanent', {
      to_email: recipientEmail,
      from_name: this.username,
      subject: 'Un código ha sido compartido contigo',
      to_name: recipientEmail,
      code: code,
      lock_alias: this.lockAlias
    }, 'VVC1yrpkN9n-1Dcc3')
      .then((response) => { console.log('Email sent successfully:', response); })
      .catch((error) => { console.error('Error sending email:', error); });
  }
  sendEmail_OneUsePasscode(recipientEmail: string, code: string) {//Template para passcode de un uso
    //esteban.vohk+4@gmail.com
    emailjs.send('contact_service', 'PasscodeOneUse', {
      to_email: recipientEmail,
      from_name: this.username,
      subject: 'Un código ha sido compartido contigo',
      to_name: recipientEmail,
      code: code,
      lock_alias: this.lockAlias
    }, 'VVC1yrpkN9n-1Dcc3')
      .then((response) => { console.log('Email sent successfully:', response); })
      .catch((error) => { console.error('Error sending email:', error); });
  }
  sendEmail_PeriodPasscode(recipientEmail: string, code: string, start: string, end: string) {//Template para passcode periodica
    //esteban.vohk+5@gmail.com
    emailjs.send('contact_service', 'PasscodePeriodica', {
      to_email: recipientEmail,
      from_name: this.username,
      subject: 'Un código ha sido compartido contigo',
      to_name: recipientEmail,
      code: code,
      lock_alias: this.lockAlias,
      start: start,
      end: end
    }, 'gmWCdpYwocA8wp4sr')
      .then((response) => { console.log('Email sent successfully:', response); })
      .catch((error) => { console.error('Error sending email:', error); });
  }
  sendEmail_ErasePasscode(recipientEmail: string, code: string) {//Template para passcode de borrar
    //esteban.vohk+5@gmail.com
    emailjs.send('contact_service', 'PasscodeBorrar', {
      to_email: recipientEmail,
      from_name: this.username,
      subject: 'Un código ha sido compartido contigo',
      to_name: recipientEmail,
      code: code,
      lock_alias: this.lockAlias
    }, 'gmWCdpYwocA8wp4sr')
      .then((response) => { console.log('Email sent successfully:', response); })
      .catch((error) => { console.error('Error sending email:', error); });
  }
  sendEmail_RecurringPasscode(recipientEmail: string, code: string, start: string, end: string, tipo: number) {//Template para passcode recurrente
    //esteban.vohk+6@gmail.com
    let days = '';
    switch (tipo) {
      case 5:
        days = "Sábados y Domingos";
        break;
      case 6:
        days = "dias";
        break;
      case 7:
        days = "Lunes, Martes, Miercoles, Jueves y Viernes";
        break;
      case 8:
        days = "Lunes";
        break;
      case 9:
        days = "Martes";
        break;
      case 10:
        days = "Miercoles";
        break;
      case 11:
        days = "Jueves";
        break;
      case 12:
        days = "Viernes";
        break;
      case 13:
        days = "Sabados";
        break;
      case 14:
        days = "Domingos";
        break;
      default:
        days = '';
        break;
    }
    emailjs.send('contact_service', 'PasscodeDias', {
      to_email: recipientEmail,
      from_name: this.username,
      subject: 'Un código ha sido compartido contigo',
      to_name: recipientEmail,
      code: code,
      lock_alias: this.lockAlias,
      start: start,
      end: end,
      days: days
    }, 'bdNkCTZsViZUFZCL9')
      .then((response) => { console.log('Email sent successfully:', response); })
      .catch((error) => { console.error('Error sending email:', error); });
  }
}
