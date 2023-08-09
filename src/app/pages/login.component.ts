import { Component} from '@angular/core';
import { UserServiceService } from '../services/user-service.service';
import { HttpClient } from '@angular/common/http'; 
import { Router } from '@angular/router';
import { User } from '../Interfaces/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: []
})
export class LoginComponent {

  loginError:string = "";
  access_token:string;

  constructor(private router: Router, public userService: UserServiceService, private http: HttpClient) {}

  async login(data:User){
    if(data.username == '' || data.password == ''){
      this.loginError = 'Debe ingresar un nombre de usuario y/o contraseña '
    }
    this.userService.setnombre_usuario(data.username);
    this.userService.setclave_usuario(data.password);
    try {
      await this.userService.getAccessToken(data.username, data.password);
      this.userService.data$.subscribe((res) => {
        if (res.access_token) {
          this.access_token = res.access_token
          this.router.navigate(['/users/', data.username]); // Navigate to the user page with the username
        } else {
          this.loginError = "Nombre de usuario y/o contraseña inválidos";
        }
      });
    } catch (error) {
      console.error("Error while fetching access token:", error);
    }
    const prefixname = 'bhaaa_'.concat(data.username);
    localStorage.setItem('user', data.username)
    localStorage.setItem('fullName', prefixname);
    localStorage.setItem('password', data.password);
    localStorage.setItem('token', this.access_token);
    this.userService.fullNombre_usuario = prefixname;
  }
}



