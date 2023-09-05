import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { LockServiceService } from './lock-service.service';
import { EkeyResponse, sendEkeyResponse } from '../Interfaces/Elements';
import { LockData, LockListResponse } from '../Interfaces/Lock';
import { RecipientList } from '../Interfaces/RecipientList';
import emailjs from 'emailjs-com';

@Injectable({
  providedIn: 'root'
})
export class EkeyServiceService {

  private dataSubject = new BehaviorSubject<any>(null);
  data$ = this.dataSubject.asObservable();
  private dataSubject2 = new BehaviorSubject<any>(null);
  data2$ = this.dataSubject2.asObservable();

  token: string;
  username = localStorage.getItem('user') ?? ''
  lockAlias = localStorage.getItem('Alias') ?? ''
  lockID: number;
  endDateUser: string;
  currentLocks: LockData[] = []
  selectedLocks: number[] = [];
  recipients: RecipientList[] = [];
  ekeysimple = false;

  constructor(private lockService: LockServiceService, private http: HttpClient) { }

  getEkeysofAccount(token: string, pageNo: number, pageSize: number, groupId?: number): Observable<LockListResponse> {
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/key/list'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: header };
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('pageNo', pageNo.toString());
    body.set('pageSize', pageSize.toString());
    body.set('date', fecha.toString());
    if (groupId !== undefined) { body.set('groupId', groupId.toString()) }
    return this.http.post<LockListResponse>(url, body.toString(), options);
  }
  getEkeysofLock(token: string, lockID: number, pageNo: number, pageSize: number): Observable<EkeyResponse> {
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/lock/listKey'
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
    return this.http.post<EkeyResponse>(url, body.toString(), options);
  }
  sendEkey(token: string, lockID: number, recieverName: string, keyName: string, startDate: string, endDate: string, keyRight: number, keyType?: number, startDay?: string, endDay?: string, weekDays?: string): Observable<sendEkeyResponse> {
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/key/send'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: header };
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockID.toString());
    body.set('receiverUsername', recieverName);
    body.set('keyName', keyName);
    body.set('startDate', startDate);
    body.set('endDate', endDate);
    body.set('date', fecha);
    body.set('keyRight', keyRight.toString());
    body.set('createUser','1');
    if (keyType !== undefined) {
      body.set('keyType', keyType.toString());
    }
    if (startDay !== undefined) {
      body.set('startDay', startDay);
    }
    if (endDay !== undefined) {
      body.set('endDay', endDay);
    }
    if (weekDays !== undefined) {
      body.set('weekDays', weekDays);
    }
    return this.http.post<sendEkeyResponse>(url, body.toString(), options);
  }
  async deleteEkey(token: string, keyID: number) {
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/key/delete'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: header };
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('keyId', keyID.toString());
    body.set('date', fecha);
    try {
      const response = await lastValueFrom(this.http.post(url, body.toString(), options));
      this.dataSubject.next(response);
      console.log(response)
    } catch (error) {
      console.error("Error while deleting a Ekey:", error);
      this.dataSubject.next(null); // Emit null to dataSubject on error
    }
  }
  async freezeEkey(token: string, keyID: number) {
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/key/freeze'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: header };
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('keyId', keyID.toString());
    body.set('date', fecha);
    try {
      const response = await lastValueFrom(this.http.post(url, body.toString(), options));
      this.dataSubject.next(response);
      console.log(response)
    } catch (error) {
      console.error("Error while freezing a Ekey:", error);
      this.dataSubject.next(null); // Emit null to dataSubject on error
    }
  }
  async unfreezeEkey(token: string, keyID: number) {
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/key/unfreeze'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: header };
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('keyId', keyID.toString());
    body.set('date', fecha);
    try {
      const response = await lastValueFrom(this.http.post(url, body.toString(), options));
      this.dataSubject.next(response);
      console.log(response)
    } catch (error) {
      console.error("Error while unfreezing a Ekey:", error);
      this.dataSubject.next(null); // Emit null to dataSubject on error
    }
  }
  async modifyEkey(token: string, ekeyID: number, newName?: string, remoteEnable?: string) {
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/key/update'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: header };
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('keyId', ekeyID.toString());
    body.set('date', fecha);
    if (newName !== undefined) {
      body.set('keyName', newName);
    }
    if (remoteEnable !== undefined) {
      body.set('remoteEnable', remoteEnable);
    }
    try {
      const response = await lastValueFrom(this.http.post(url, body.toString(), options));
      this.dataSubject.next(response);
      console.log(response)
    } catch (error) {
      console.error("Error while modifying a Ekey:", error);
      this.dataSubject.next(null); // Emit null to dataSubject on error
    }
  }
  async changePeriod(token: string, ekeyID: number, newStartDate: string, newEndDate: string) {
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/key/changePeriod'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: header };
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('keyId', ekeyID.toString());
    body.set('startDate', newStartDate);
    body.set('endDate', newEndDate);
    body.set('date', fecha);
    try {
      const response = await lastValueFrom(this.http.post(url, body.toString(), options));
      this.dataSubject.next(response);
      console.log(response)
    } catch (error) {
      console.error("Error while changing the validity period of the fingerprint:", error);
      this.dataSubject.next(null); // Emit null to dataSubject on error
    }
  }
  async AuthorizeEkey(token: string, lockID: number, keyID: number) {
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/key/authorize'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: header };
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockID.toString());
    body.set('keyId', keyID.toString());
    body.set('date', fecha);
    try {
      const response = await lastValueFrom(this.http.post(url, body.toString(), options));
      this.dataSubject.next(response);
      console.log(response)
    } catch (error) {
      console.error("Error while authorizing a Ekey:", error);
      this.dataSubject.next(null); // Emit null to dataSubject on error
    }
  }
  async cancelAuthorizeEkey(token: string, lockID: number, keyID: number) {
    let fecha = this.lockService.timestamp()
    let url = 'https://euapi.ttlock.com/v3/key/unauthorize'
    let header = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = { headers: header };
    let body = new URLSearchParams();
    body.set('clientId', 'c4114592f7954ca3b751c44d81ef2c7d');
    body.set('accessToken', token);
    body.set('lockId', lockID.toString());
    body.set('keyId', keyID.toString());
    body.set('date', fecha);
    try {
      const response = await lastValueFrom(this.http.post(url, body.toString(), options));
      this.dataSubject.next(response);
      console.log(response)
    } catch (error) {
      console.error("Error while authorizing a Ekey:", error);
      this.dataSubject.next(null); // Emit null to dataSubject on error
    }
  }
  sendEmail_permanentEkey(recipientEmail: string, keyName: string) {//Template para eKey permanente a una cuenta existente
    //esteban.vohk@gmail.com
    emailjs.send('contact_service', 'SendEkeyPermanent', {
      to_email: recipientEmail,
      from_name: this.username,
      subject: 'Una eKey ha sido compartida contigo',
      to_name: recipientEmail,
      lock_alias: this.lockAlias,
      ekey_name: keyName
    }, 'IHg0KzBkt_UoFb1yg')
      .then((response) => { console.log('Email sent successfully:', response); })
      .catch((error) => { console.error('Error sending email:', error); });
  }
  sendEmail_periodicEkey(recipientEmail: string, keyName: string, start: string, end: string) {//Template para eKey periodica a una cuenta existente
    //esteban.vohk@gmail.com
    emailjs.send('contact_service', 'SendEkeyPeriodic', {
      to_email: recipientEmail,
      from_name: this.username,
      subject: 'Una eKey ha sido compartida contigo',
      to_name: recipientEmail,
      lock_alias: this.lockAlias,
      ekey_name: keyName,
      start: start,
      end: end
    }, 'IHg0KzBkt_UoFb1yg')
      .then((response) => { console.log('Email sent successfully:', response); })
      .catch((error) => { console.error('Error sending email:', error); });
  }
  sendEmail_oneTimeEkey(recipientEmail: string, keyName: string) {//Template para eKey de un uso a una cuenta existente
    //esteban.vohk+1@gmail.com
    emailjs.send('contact_service', 'SendEkeyOneTime', {
      to_email: recipientEmail,
      from_name: this.username,
      subject: 'Una eKey ha sido compartida contigo',
      to_name: recipientEmail,
      lock_alias: this.lockAlias,
      ekey_name: keyName
    }, 'JGXYy0TqnFt_IB5f4')
      .then((response) => { console.log('Email sent successfully:', response); })
      .catch((error) => { console.error('Error sending email:', error); });
  }
  sendEmail_solicitanteEkey(recipientEmail: string, keyName: string, weekDays: string, start: string, end: string) {//Template para eKey solicitante a una cuenta existente
    //esteban.vohk+1@gmail.com
    emailjs.send('contact_service', 'SendEkeySolicitante', {
      to_email: recipientEmail,
      from_name: this.username,
      subject: 'Una eKey ha sido compartida contigo',
      to_name: recipientEmail,
      lock_alias: this.lockAlias,
      ekey_name: keyName,
      week_days: weekDays,
      start: start,
      end: end
    }, 'JGXYy0TqnFt_IB5f4')
      .then((response) => { console.log('Email sent successfully:', response); })
      .catch((error) => { console.error('Error sending email:', error); });
  }
  sendEmail_permanentEkey_newAccount(recipientEmail: string, keyName: string, password: string) {//Template para eKey permanente a una cuenta nueva
    //esteban.vohk+2@gmail.com
    emailjs.send('contact_service', 'SendEkeyPermanentNewUser', {
      to_email: recipientEmail,
      from_name: this.username,
      subject: 'Una eKey ha sido compartida contigo',
      to_name: recipientEmail,
      lock_alias: this.lockAlias,
      password: password,
      ekey_name: keyName
    }, '8Q0_n1lg4twgrBlaf')
      .then((response) => { console.log('Email sent successfully:', response); })
      .catch((error) => { console.error('Error sending email:', error); });
  }
  sendEmail_periodicEkey_newAccount(recipientEmail: string, keyName: string, start: string, end: string, password: string) {//Template para eKey periodica a una cuenta nueva
    //esteban.vohk+2@gmail.com
    emailjs.send('contact_service', 'SendEkeyPeriodicNewUser', {
      to_email: recipientEmail,
      from_name: this.username,
      subject: 'Una eKey ha sido compartida contigo',
      to_name: recipientEmail,
      lock_alias: this.lockAlias,
      password: password,
      ekey_name: keyName,
      start: start,
      end: end
    }, '8Q0_n1lg4twgrBlaf')
      .then((response) => { console.log('Email sent successfully:', response); })
      .catch((error) => { console.error('Error sending email:', error); });
  }
  sendEmail_oneTimeEkey_newAccount(recipientEmail: string, keyName: string, password: string) {//Template para eKey de un uso a una cuenta nueva
    //esteban.vohk+3@gmail.com
    emailjs.send('contact_service', 'SendEkeyOneTimeNewUser', {
      to_email: recipientEmail,
      from_name: this.username,
      subject: 'Una eKey ha sido compartida contigo',
      to_name: recipientEmail,
      lock_alias: this.lockAlias,
      password: password,
      ekey_name: keyName
    }, 'ENb99SX5j4gqE1TFZ')
      .then((response) => { console.log('Email sent successfully:', response); })
      .catch((error) => { console.error('Error sending email:', error); });
  }
  sendEmail_solicitanteEkey_newAccount(recipientEmail: string, keyName: string, weekDays: string, start: string, end: string, password: string) {//Template para eKey solicitante a una cuenta nueva
    //esteban.vohk+3@gmail.com
    emailjs.send('contact_service', 'SendEkeySolicitanteNewUs', {
      to_email: recipientEmail,
      from_name: this.username,
      subject: 'Una eKey ha sido compartida contigo',
      to_name: recipientEmail,
      lock_alias: this.lockAlias,
      password: password,
      ekey_name: keyName,
      week_days: weekDays,
      start: start,
      end: end
    }, 'ENb99SX5j4gqE1TFZ')
      .then((response) => { console.log('Email sent successfully:', response); })
      .catch((error) => { console.error('Error sending email:', error); });
  }
}
