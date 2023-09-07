import { Component } from '@angular/core';
import { UserServiceService } from '../../services/user-service.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { GetAccessTokenResponse, User } from '../../Interfaces/User';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: []
})
export class LoginComponent {

  loginError: string = "";
  access_token: string;

  constructor(private router: Router, public userService: UserServiceService, private http: HttpClient) { }

  async login(data: User) {
    let encode = this.userService.customBase64Encode(data.username);
    let response;
    if (data.username == '' && data.password == '') {
      this.loginError = 'Debe ingresar un nombre de usuario y contraseña '
    } else if (data.username == '') {
      this.loginError = 'Debe ingresar un nombre de usuario '
    } else if (data.password == '') {
      this.loginError = 'Debe ingresar una contraseña '
    } else {
      response = await lastValueFrom(this.userService.getAccessToken(data.username, data.password)) as GetAccessTokenResponse;
      console.log("Primer intento(cuenta TTLock)",response)
      if (response.access_token) {
        this.access_token = response.access_token
        localStorage.setItem('logged', '1')
        localStorage.setItem('user', data.username)
        localStorage.setItem('password', data.password);
        localStorage.setItem('token', this.access_token);
        this.router.navigate(['/users/', data.username]);
      } else {
        response = await lastValueFrom(this.userService.getAccessToken('bhaaa_'.concat(encode), data.password)) as GetAccessTokenResponse;
        console.log("Segundo intento(cuenta PC)",response)
        if (response.access_token) {
          this.access_token = response.access_token
          localStorage.setItem('logged', '1')
          localStorage.setItem('user', data.username)
          localStorage.setItem('password', data.password);
          localStorage.setItem('token', this.access_token);
          this.router.navigate(['/users/', data.username]);
        } else {
          this.loginError = "Nombre de usuario y/o contraseña inválidos";
        }
      }
    }
  }
}



